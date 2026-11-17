-- All commerce mutations are callable only by the trusted server using its
-- service-role connection after checking the current Auth user/admin session.
-- Explicit revokes immediately follow each SECURITY DEFINER function.

create function public.store_set_cart_item(
  p_user_id uuid, p_variant_id uuid, p_kit_id uuid, p_quantity integer
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_cart_id uuid;
  v_item_id uuid;
  v_available integer;
  v_expected integer;
  v_valid integer;
begin
  if p_user_id is null or ((p_variant_id is not null)::integer + (p_kit_id is not null)::integer) <> 1
     or p_quantity < 0 or p_quantity > 100 or p_quantity is null then
    raise exception 'Invalid cart item' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user_id::text, 0));
  insert into public.store_carts (user_id) values (p_user_id)
    on conflict (user_id) do update set updated_at = now()
    returning id into v_cart_id;
  if p_quantity = 0 then
    delete from public.store_cart_items where cart_id = v_cart_id
      and ((p_variant_id is not null and variant_id = p_variant_id)
        or (p_kit_id is not null and kit_id = p_kit_id));
    return null;
  end if;

  if p_variant_id is not null then
    select i.on_hand - i.reserved into v_available
    from public.store_product_variants v
    join public.store_products p on p.id = v.product_id
    join public.store_categories c on c.id = p.category_id
    join public.store_inventory i on i.variant_id = v.id
    where v.id = p_variant_id and v.active and v.tax_rate_bps is not null
      and p.published and p.archived_at is null and c.published;
    if v_available is null or v_available < p_quantity then
      raise exception 'Product is unavailable or has insufficient stock' using errcode = 'P0001';
    end if;
    insert into public.store_cart_items(cart_id, variant_id, quantity)
      values (v_cart_id, p_variant_id, p_quantity)
      on conflict (cart_id, variant_id) where variant_id is not null
      do update set quantity = excluded.quantity, updated_at = now()
      returning id into v_item_id;
  else
    select count(*) into v_expected from public.store_kit_components where kit_id = p_kit_id;
    select count(*), min((i.on_hand - i.reserved) / kc.required_quantity)
      into v_valid, v_available
    from public.store_kits k
    join public.store_kit_components kc on kc.kit_id = k.id
    join public.store_product_variants v on v.id = kc.variant_id and v.active
    join public.store_products p on p.id = v.product_id and p.published and p.archived_at is null
    join public.store_categories c on c.id = p.category_id and c.published
    join public.store_inventory i on i.variant_id = v.id
    where k.id = p_kit_id and k.published and k.archived_at is null
      and k.tax_rate_bps is not null;
    if v_expected = 0 or v_valid <> v_expected or v_available is null or v_available < p_quantity then
      raise exception 'Kit is unavailable or has insufficient shared stock' using errcode = 'P0001';
    end if;
    insert into public.store_cart_items(cart_id, kit_id, quantity)
      values (v_cart_id, p_kit_id, p_quantity)
      on conflict (cart_id, kit_id) where kit_id is not null
      do update set quantity = excluded.quantity, updated_at = now()
      returning id into v_item_id;
  end if;
  return v_item_id;
end;
$$;
revoke all on function public.store_set_cart_item(uuid,uuid,uuid,integer) from public, anon, authenticated;
grant execute on function public.store_set_cart_item(uuid,uuid,uuid,integer) to service_role;

create function public.store_adjust_inventory(
  p_variant_id uuid, p_delta integer, p_actor uuid, p_reason text, p_notes text default null
) returns integer
language plpgsql security definer set search_path = '' as $$
declare v_new integer;
begin
  if p_delta is null or p_delta = 0 or abs(p_delta) > 100000
     or p_reason not in ('receive','adjust','return_restock')
     or p_actor is null then
    raise exception 'Invalid stock adjustment' using errcode = '22023';
  end if;
  if not exists (select 1 from public.admins where user_id = p_actor) then
    raise exception 'Admin membership required' using errcode = '42501';
  end if;
  insert into public.store_inventory(variant_id) values (p_variant_id)
    on conflict (variant_id) do nothing;
  update public.store_inventory
    set on_hand = on_hand + p_delta, updated_at = now()
    where variant_id = p_variant_id and on_hand + p_delta >= reserved
    returning on_hand into v_new;
  if v_new is null then
    raise exception 'Stock adjustment would make inventory negative or below reserved stock' using errcode = 'P0001';
  end if;
  insert into public.store_inventory_movements(variant_id,delta_on_hand,reason,actor_user_id,notes)
    values(p_variant_id,p_delta,p_reason,p_actor,left(p_notes,1000));
  return v_new;
end;
$$;
revoke all on function public.store_adjust_inventory(uuid,integer,uuid,text,text) from public, anon, authenticated;
grant execute on function public.store_adjust_inventory(uuid,integer,uuid,text,text) to service_role;

create function public.store_place_offline_order(
  p_user_id uuid,
  p_idempotency_key uuid,
  p_customer_name text,
  p_mobile text,
  p_email text,
  p_delivery_method text,
  p_payment_method text,
  p_address jsonb,
  p_notes text default null
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_settings public.store_settings%rowtype;
  v_cart_id uuid;
  v_order_id uuid;
  v_verified_student boolean;
  v_discount_bps integer := 0;
  v_subtotal bigint := 0;
  v_discount bigint := 0;
  v_delivery bigint := 0;
  v_tax bigint := 0;
  v_gross bigint;
  v_line_discount bigint;
  v_line_tax bigint;
  v_items jsonb := '[]'::jsonb;
  v_components jsonb;
  v_pickup jsonb;
  v_address jsonb;
  v_line record;
  v_product record;
  v_kit record;
  v_rule record;
  v_demand record;
  v_stock record;
  v_item jsonb;
  v_expected integer;
  v_valid integer;
begin
  if p_user_id is null or p_idempotency_key is null
    or length(trim(coalesce(p_customer_name,''))) < 2
    or p_mobile !~ '^([+]91[ -]?)?[6-9][0-9]{9}$'
    or length(coalesce(p_notes,'')) > 2000 then
    raise exception 'Invalid checkout details' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user_id::text, 0));
  select id into v_order_id from public.store_orders
    where user_id = p_user_id and idempotency_key = p_idempotency_key;
  if v_order_id is not null then return v_order_id; end if;

  select * into v_settings from public.store_settings where id = true for share;
  if not found then raise exception 'Store is not configured' using errcode = 'P0001'; end if;
  select exists (
    select 1 from public.store_student_links sl
    join public.student_registrations sr on sr.id = sl.registration_id
    where sl.user_id = p_user_id and sr.status = 'admitted' and sr.course_id is not null
  ) into v_verified_student;
  if not v_settings.public_shopping and not v_verified_student then
    raise exception 'A verified admitted student account is required' using errcode = '42501';
  end if;
  if v_settings.student_discount_enabled and v_verified_student then
    v_discount_bps := v_settings.student_discount_bps;
  end if;

  if p_delivery_method = 'pickup' and p_payment_method = 'pay_at_pickup' then
    if not v_settings.pickup_enabled or not v_settings.pay_at_pickup_enabled
      or nullif(trim(coalesce(v_settings.pickup_address,'')),'') is null
      or nullif(trim(coalesce(v_settings.pickup_hours,'')),'') is null then
      raise exception 'Institute pickup is not configured' using errcode = 'P0001';
    end if;
    v_pickup := pg_catalog.jsonb_build_object(
      'address',v_settings.pickup_address,
      'hours',v_settings.pickup_hours,
      'instructions',v_settings.pickup_instructions
    );
  elsif p_delivery_method = 'home_delivery' and p_payment_method = 'cash_on_delivery' then
    if not v_settings.home_delivery_enabled or not v_settings.cash_on_delivery_enabled
      or p_address is null or pg_catalog.jsonb_typeof(p_address) <> 'object'
      or length(trim(coalesce(p_address->>'line1',''))) < 5
      or length(trim(coalesce(p_address->>'city',''))) < 2
      or length(trim(coalesce(p_address->>'state',''))) < 2
      or (p_address->>'pin_code') !~ '^[0-9]{6}$' then
      raise exception 'Home delivery address or method is not configured' using errcode = 'P0001';
    end if;
    select * into v_rule from public.store_delivery_rules
      where pin_code = p_address->>'pin_code' and active for share;
    if not found or v_rule.tax_rate_bps is null then
      raise exception 'Delivery is not available for this PIN code' using errcode = 'P0001';
    end if;
    v_address := pg_catalog.jsonb_build_object(
      'line1',trim(p_address->>'line1'), 'line2',nullif(trim(p_address->>'line2'),''),
      'city',trim(p_address->>'city'), 'state',trim(p_address->>'state'),
      'pin_code',p_address->>'pin_code', 'estimate',v_rule.estimate_text
    );
    v_delivery := v_rule.charge_paise;
    v_tax := pg_catalog.round((v_delivery::numeric * v_rule.tax_rate_bps) / 10000)::bigint;
  else
    raise exception 'Unsupported delivery or payment method' using errcode = '22023';
  end if;

  select id into v_cart_id from public.store_carts where user_id = p_user_id for update;
  if v_cart_id is null then raise exception 'Cart is empty' using errcode = 'P0001'; end if;
  select count(*) into v_expected from public.store_cart_items where cart_id = v_cart_id;
  if v_expected = 0 or v_expected > 100 then
    raise exception 'Cart is empty or too large' using errcode = 'P0001';
  end if;

  -- Capture immutable line snapshots from current catalog rows. Price rows are
  -- share-locked until transaction commit so admin edits cannot change figures.
  for v_line in select * from public.store_cart_items where cart_id = v_cart_id order by id loop
    if v_line.variant_id is not null then
      select p.id as product_id,p.name,p.unit,v.attributes,v.price_paise,v.tax_rate_bps
        into v_product
      from public.store_product_variants v
      join public.store_products p on p.id = v.product_id
      join public.store_categories c on c.id = p.category_id
      where v.id = v_line.variant_id and v.active and v.tax_rate_bps is not null
        and p.published and p.archived_at is null and c.published
      for share of v,p;
      if not found then raise exception 'A cart product is no longer available' using errcode = 'P0001'; end if;
      v_gross := v_product.price_paise * v_line.quantity;
      v_line_discount := pg_catalog.round((v_gross::numeric * v_discount_bps) / 10000)::bigint;
      v_line_tax := pg_catalog.round(((v_gross-v_line_discount)::numeric * v_product.tax_rate_bps) / 10000)::bigint;
      v_items := v_items || pg_catalog.jsonb_build_array(pg_catalog.jsonb_build_object(
        'kind','product','product_id',v_product.product_id,'variant_id',v_line.variant_id,
        'name',v_product.name,'variant',v_product.attributes,'unit',v_product.unit,
        'quantity',v_line.quantity,'unit_price_paise',v_product.price_paise,
        'discount_paise',v_line_discount,'tax_paise',v_line_tax,
        'line_total_paise',v_gross-v_line_discount+v_line_tax
      ));
    else
      select k.name,k.price_paise,k.tax_rate_bps,k.course_id into v_kit
      from public.store_kits k where k.id = v_line.kit_id and k.published
        and k.archived_at is null and k.tax_rate_bps is not null
      for share of k;
      if not found then raise exception 'A cart kit is no longer available' using errcode = 'P0001'; end if;
      select count(*) into v_expected from public.store_kit_components where kit_id = v_line.kit_id;
      select count(*), pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
        'variant_id',v.id,'sku',v.sku,'name',p.name,'attributes',v.attributes,
        'quantity',kc.required_quantity
      ) order by v.id) into v_valid,v_components
      from public.store_kit_components kc
      join public.store_product_variants v on v.id = kc.variant_id and v.active
      join public.store_products p on p.id = v.product_id and p.published and p.archived_at is null
      join public.store_categories c on c.id = p.category_id and c.published
      where kc.kit_id = v_line.kit_id;
      if v_expected = 0 or v_valid <> v_expected then
        raise exception 'A kit component is no longer available' using errcode = 'P0001';
      end if;
      v_gross := v_kit.price_paise * v_line.quantity;
      v_line_discount := pg_catalog.round((v_gross::numeric * v_discount_bps) / 10000)::bigint;
      v_line_tax := pg_catalog.round(((v_gross-v_line_discount)::numeric * v_kit.tax_rate_bps) / 10000)::bigint;
      v_items := v_items || pg_catalog.jsonb_build_array(pg_catalog.jsonb_build_object(
        'kind','kit','kit_id',v_line.kit_id,'name',v_kit.name,'unit','set',
        'components',v_components,'course_id',v_kit.course_id,
        'quantity',v_line.quantity,'unit_price_paise',v_kit.price_paise,
        'discount_paise',v_line_discount,'tax_paise',v_line_tax,
        'line_total_paise',v_gross-v_line_discount+v_line_tax
      ));
    end if;
    v_subtotal := v_subtotal + v_gross;
    v_discount := v_discount + v_line_discount;
    v_tax := v_tax + v_line_tax;
  end loop;

  -- Product lines and kit components expand into the same variant demand.
  -- Lock every inventory row in UUID order before deducting any stock.
  for v_demand in
    with demand as (
      select ci.variant_id,ci.quantity from public.store_cart_items ci
        where ci.cart_id = v_cart_id and ci.variant_id is not null
      union all
      select kc.variant_id,ci.quantity * kc.required_quantity
        from public.store_cart_items ci
        join public.store_kit_components kc on kc.kit_id = ci.kit_id
        where ci.cart_id = v_cart_id and ci.kit_id is not null
    )
    select variant_id,sum(quantity)::integer as quantity from demand
      group by variant_id order by variant_id
  loop
    select on_hand,reserved into v_stock from public.store_inventory
      where variant_id = v_demand.variant_id for update;
    if not found or v_stock.on_hand - v_stock.reserved < v_demand.quantity then
      raise exception 'Insufficient shared inventory' using errcode = 'P0001';
    end if;
  end loop;

  insert into public.store_orders(
    user_id,idempotency_key,delivery_method,payment_method,customer_name,mobile,email,
    address_snapshot,pickup_snapshot,notes,subtotal_paise,discount_paise,
    delivery_paise,tax_paise,total_paise
  ) values (
    p_user_id,p_idempotency_key,p_delivery_method,p_payment_method,trim(p_customer_name),
    trim(p_mobile),nullif(trim(p_email),''),v_address,v_pickup,left(p_notes,2000),
    v_subtotal,v_discount,v_delivery,v_tax,v_subtotal-v_discount+v_delivery+v_tax
  ) returning id into v_order_id;

  for v_item in select value from pg_catalog.jsonb_array_elements(v_items) loop
    insert into public.store_order_items(
      order_id,product_id,variant_id,kit_id,kind,name_snapshot,variant_snapshot,
      components_snapshot,unit_snapshot,quantity,unit_price_paise,discount_paise,
      tax_paise,line_total_paise
    ) values (
      v_order_id,(v_item->>'product_id')::uuid,(v_item->>'variant_id')::uuid,
      (v_item->>'kit_id')::uuid,v_item->>'kind',v_item->>'name',v_item->'variant',
      v_item->'components',v_item->>'unit',(v_item->>'quantity')::integer,
      (v_item->>'unit_price_paise')::bigint,(v_item->>'discount_paise')::bigint,
      (v_item->>'tax_paise')::bigint,(v_item->>'line_total_paise')::bigint
    );
  end loop;

  for v_demand in
    with demand as (
      select ci.variant_id,ci.quantity from public.store_cart_items ci
        where ci.cart_id = v_cart_id and ci.variant_id is not null
      union all
      select kc.variant_id,ci.quantity * kc.required_quantity
        from public.store_cart_items ci
        join public.store_kit_components kc on kc.kit_id = ci.kit_id
        where ci.cart_id = v_cart_id and ci.kit_id is not null
    )
    select variant_id,sum(quantity)::integer as quantity from demand
      group by variant_id order by variant_id
  loop
    update public.store_inventory set on_hand = on_hand - v_demand.quantity,
      updated_at = now() where variant_id = v_demand.variant_id;
    insert into public.store_order_stock(order_id,variant_id,quantity)
      values(v_order_id,v_demand.variant_id,v_demand.quantity);
    insert into public.store_inventory_movements(variant_id,order_id,delta_on_hand,reason)
      values(v_demand.variant_id,v_order_id,-v_demand.quantity,'sale');
  end loop;
  insert into public.store_order_status_history(order_id,new_status)
    values(v_order_id,'order_placed');
  insert into public.store_payments(order_id,provider,amount_paise)
    values(v_order_id,p_payment_method,v_subtotal-v_discount+v_delivery+v_tax);
  delete from public.store_cart_items where cart_id = v_cart_id;
  return v_order_id;
end;
$$;
revoke all on function public.store_place_offline_order(uuid,uuid,text,text,text,text,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.store_place_offline_order(uuid,uuid,text,text,text,text,text,jsonb,text) to service_role;

-- Serializes kit composition edits against checkout's shared lock on the kit.
create function public.store_lock_kit_components() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    perform 1 from public.store_kits where id = new.kit_id for update;
    return new;
  elsif tg_op = 'DELETE' then
    perform 1 from public.store_kits where id = old.kit_id for update;
    return old;
  else
    perform 1 from public.store_kits where id in (old.kit_id,new.kit_id)
      order by id for update;
    return new;
  end if;
end;
$$;
revoke all on function public.store_lock_kit_components() from public, anon, authenticated;
create trigger store_kit_components_lock
  before insert or update or delete on public.store_kit_components
  for each row execute function public.store_lock_kit_components();

create function public.store_transition_order(
  p_order_id uuid, p_new_status text, p_actor uuid, p_notes text default null,
  p_tracking_reference text default null
) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_order public.store_orders%rowtype;
  v_stock record;
begin
  if p_actor is null or not exists (select 1 from public.admins where user_id = p_actor) then
    raise exception 'Admin membership required' using errcode = '42501';
  end if;
  select * into v_order from public.store_orders where id = p_order_id for update;
  if not found then raise exception 'Order not found' using errcode = 'P0002'; end if;
  if not (
    (v_order.delivery_method = 'pickup' and (
      (v_order.fulfillment_status = 'order_placed' and p_new_status in ('preparing','cancelled')) or
      (v_order.fulfillment_status = 'preparing' and p_new_status in ('ready_for_pickup','cancelled')) or
      (v_order.fulfillment_status = 'ready_for_pickup' and p_new_status in ('collected','cancelled'))
    )) or
    (v_order.delivery_method = 'home_delivery' and (
      (v_order.fulfillment_status = 'order_placed' and p_new_status in ('processing','cancelled')) or
      (v_order.fulfillment_status = 'processing' and p_new_status in ('shipped','cancelled')) or
      (v_order.fulfillment_status = 'shipped' and p_new_status = 'delivered')
    ))
  ) then
    raise exception 'Invalid fulfillment transition' using errcode = '22023';
  end if;
  if p_new_status = 'cancelled' then
    if v_order.payment_state <> 'pending' then
      raise exception 'Paid orders require a separate reviewed refund flow' using errcode = 'P0001';
    end if;
    for v_stock in select variant_id,quantity from public.store_order_stock
      where order_id = p_order_id order by variant_id loop
      update public.store_inventory set on_hand = on_hand + v_stock.quantity,
        updated_at = now() where variant_id = v_stock.variant_id;
      insert into public.store_inventory_movements(
        variant_id,order_id,delta_on_hand,reason,actor_user_id,notes
      ) values (v_stock.variant_id,p_order_id,v_stock.quantity,'cancel_release',p_actor,left(p_notes,1000));
    end loop;
    update public.store_payments set state = 'failed',updated_at = now()
      where order_id = p_order_id and state = 'pending';
    update public.store_orders set payment_state = 'failed' where id = p_order_id;
  end if;
  update public.store_orders set fulfillment_status = p_new_status,
    tracking_reference = case when p_new_status = 'shipped' then nullif(trim(p_tracking_reference),'') else tracking_reference end,
    updated_at = now() where id = p_order_id;
  insert into public.store_order_status_history(order_id,previous_status,new_status,actor_user_id,notes)
    values(p_order_id,v_order.fulfillment_status,p_new_status,p_actor,left(p_notes,1000));
  return p_new_status;
end;
$$;
revoke all on function public.store_transition_order(uuid,text,uuid,text,text) from public, anon, authenticated;
grant execute on function public.store_transition_order(uuid,text,uuid,text,text) to service_role;

-- Offline collection is a staff attestation with a real receipt/reference, not
-- a browser payment-success callback. Only an existing owner may record it.
create function public.store_record_offline_payment(
  p_order_id uuid, p_actor uuid, p_reference text, p_note text
) returns void
language plpgsql security definer set search_path = '' as $$
declare v_order public.store_orders%rowtype;
begin
  if p_actor is null or not exists (
    select 1 from public.admins where user_id = p_actor and role = 'owner'
  ) then raise exception 'Owner membership required' using errcode = '42501'; end if;
  if length(trim(coalesce(p_reference,''))) < 4 or length(trim(coalesce(p_note,''))) < 8 then
    raise exception 'Collection reference and verification note are required' using errcode = '22023';
  end if;
  select * into v_order from public.store_orders where id = p_order_id for update;
  if not found or v_order.payment_state <> 'pending' or v_order.fulfillment_status = 'cancelled' then
    raise exception 'Order cannot accept a payment record' using errcode = 'P0001';
  end if;
  update public.store_payments set state = 'paid', provider_reference = trim(p_reference),
    verified_at = now(), verified_by = p_actor, verification_note = left(p_note,1000),
    updated_at = now()
    where order_id = p_order_id and state = 'pending' and amount_paise = v_order.total_paise;
  if not found then raise exception 'Matching pending payment not found' using errcode = 'P0001'; end if;
  update public.store_orders set payment_state = 'paid',updated_at = now() where id = p_order_id;
end;
$$;
revoke all on function public.store_record_offline_payment(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.store_record_offline_payment(uuid,uuid,text,text) to service_role;
