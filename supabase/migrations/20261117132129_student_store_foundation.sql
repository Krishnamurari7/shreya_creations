-- Student Store: isolated commerce data, linked to the existing courses, Auth users,
-- student registrations and admin membership. No sellable catalog rows are seeded.

create table public.store_settings (
  id boolean primary key default true check (id),
  public_shopping boolean not null default false,
  pickup_enabled boolean not null default false,
  home_delivery_enabled boolean not null default false,
  pay_at_pickup_enabled boolean not null default false,
  cash_on_delivery_enabled boolean not null default false,
  student_discount_enabled boolean not null default false,
  student_discount_bps integer check (student_discount_bps between 0 and 10000),
  pickup_address text,
  pickup_hours text,
  pickup_instructions text,
  support_email text,
  support_phone text,
  return_policy text,
  replacement_policy text,
  cancellation_policy text,
  store_terms text,
  updated_at timestamptz not null default now(),
  constraint store_discount_configured check (not student_discount_enabled or student_discount_bps is not null)
);
insert into public.store_settings (id) values (true);

create table public.store_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  image_path text,
  image_alt text,
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Navigation taxonomy only. No product, kit, price, or stock is invented.
insert into public.store_categories(name,slug,display_order,published) values
  ('Cutting Tools','cutting-tools',10,true),
  ('Measuring & Drafting Tools','measuring-drafting-tools',20,true),
  ('Machine Accessories','machine-accessories',30,true),
  ('Stitching Essentials','stitching-essentials',40,true),
  ('Embroidery & Design','embroidery-design',50,true);

create table public.store_products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.store_categories(id),
  name text not null check (length(trim(name)) between 2 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  usage text,
  specifications jsonb not null default '{}'::jsonb check (jsonb_typeof(specifications) = 'object'),
  compatible_models text,
  unit text not null check (unit in ('piece','set','metre')),
  published boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index store_products_category_idx on public.store_products(category_id, published);
create index store_products_published_created_idx on public.store_products(created_at desc) where published and archived_at is null;

create table public.store_product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.store_products(id) on delete cascade,
  object_path text not null check (length(object_path) between 1 and 500),
  alt_text text not null check (length(trim(alt_text)) > 0),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, object_path)
);
create index store_product_images_order_idx on public.store_product_images(product_id, display_order, id);

create table public.store_product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.store_products(id),
  sku text not null unique check (length(trim(sku)) between 2 and 80),
  attributes jsonb not null default '{}'::jsonb check (jsonb_typeof(attributes) = 'object'),
  price_paise bigint not null check (price_paise >= 0),
  tax_rate_bps integer check (tax_rate_bps between 0 and 10000),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index store_product_variants_product_idx on public.store_product_variants(product_id, active);

create table public.store_inventory (
  variant_id uuid primary key references public.store_product_variants(id),
  on_hand integer not null default 0 check (on_hand >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  updated_at timestamptz not null default now(),
  check (reserved <= on_hand)
);

create table public.store_kits (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  name text not null check (length(trim(name)) between 2 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  specifications jsonb not null default '{}'::jsonb check (jsonb_typeof(specifications) = 'object'),
  excluded_items text,
  price_paise bigint not null check (price_paise >= 0),
  tax_rate_bps integer check (tax_rate_bps between 0 and 10000),
  published boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index store_kits_course_idx on public.store_kits(course_id, published);
create index store_kits_published_created_idx on public.store_kits(created_at desc) where published and archived_at is null;

create table public.store_kit_images (
  id uuid primary key default gen_random_uuid(),
  kit_id uuid not null references public.store_kits(id) on delete cascade,
  object_path text not null check (length(object_path) between 1 and 500),
  alt_text text not null check (length(trim(alt_text)) > 0),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (kit_id, object_path)
);
create index store_kit_images_order_idx on public.store_kit_images(kit_id, display_order, id);

create table public.store_kit_components (
  kit_id uuid not null references public.store_kits(id) on delete cascade,
  variant_id uuid not null references public.store_product_variants(id),
  required_quantity integer not null check (required_quantity between 1 and 1000),
  primary key (kit_id, variant_id)
);
create index store_kit_components_variant_idx on public.store_kit_components(variant_id);

create table public.store_course_recommendations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  product_id uuid references public.store_products(id) on delete cascade,
  kit_id uuid references public.store_kits(id) on delete cascade,
  display_order integer not null default 0,
  check ((product_id is not null)::integer + (kit_id is not null)::integer = 1)
);
create unique index store_recommendation_product_unique on public.store_course_recommendations(course_id, product_id) where product_id is not null;
create unique index store_recommendation_kit_unique on public.store_course_recommendations(course_id, kit_id) where kit_id is not null;
create index store_recommendation_product_idx on public.store_course_recommendations(product_id);
create index store_recommendation_kit_idx on public.store_course_recommendations(kit_id);

-- A link is verified by staff only after the existing registration is admitted.
-- A student can have multiple admitted course registrations; batches are optional
-- because the existing registration records do not store a batch foreign key.
create table public.store_student_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  registration_id uuid not null unique references public.student_registrations(id),
  batch_id uuid references public.batches(id),
  verified_by uuid not null references auth.users(id),
  verified_at timestamptz not null default now(),
  unique (user_id, registration_id)
);
create index store_student_links_user_idx on public.store_student_links(user_id);
create index store_student_links_batch_idx on public.store_student_links(batch_id);

create table public.store_carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.store_cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.store_carts(id) on delete cascade,
  variant_id uuid references public.store_product_variants(id),
  kit_id uuid references public.store_kits(id),
  quantity integer not null check (quantity between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((variant_id is not null)::integer + (kit_id is not null)::integer = 1)
);
create unique index store_cart_variant_unique on public.store_cart_items(cart_id, variant_id) where variant_id is not null;
create unique index store_cart_kit_unique on public.store_cart_items(cart_id, kit_id) where kit_id is not null;
create index store_cart_items_variant_idx on public.store_cart_items(variant_id);
create index store_cart_items_kit_idx on public.store_cart_items(kit_id);

create table public.store_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text not null,
  mobile text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pin_code text not null check (pin_code ~ '^[0-9]{6}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index store_addresses_user_idx on public.store_addresses(user_id);

create table public.store_delivery_rules (
  id uuid primary key default gen_random_uuid(),
  pin_code text not null unique check (pin_code ~ '^[0-9]{6}$'),
  charge_paise bigint not null check (charge_paise >= 0),
  tax_rate_bps integer check (tax_rate_bps between 0 and 10000),
  estimate_text text,
  active boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.store_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  idempotency_key uuid not null,
  delivery_method text not null check (delivery_method in ('pickup','home_delivery')),
  payment_method text not null check (payment_method in ('pay_at_pickup','cash_on_delivery')),
  payment_state text not null default 'pending' check (payment_state in ('pending','paid','failed','refunded')),
  fulfillment_status text not null default 'order_placed' check (fulfillment_status in ('order_placed','processing','shipped','delivered','preparing','ready_for_pickup','collected','cancelled')),
  customer_name text not null,
  mobile text not null,
  email text,
  address_snapshot jsonb,
  pickup_snapshot jsonb,
  notes text,
  subtotal_paise bigint not null check (subtotal_paise >= 0),
  discount_paise bigint not null default 0 check (discount_paise >= 0),
  delivery_paise bigint not null default 0 check (delivery_paise >= 0),
  tax_paise bigint not null default 0 check (tax_paise >= 0),
  total_paise bigint not null check (total_paise >= 0),
  tracking_reference text,
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idempotency_key),
  check ((delivery_method = 'pickup' and pickup_snapshot is not null and address_snapshot is null and payment_method = 'pay_at_pickup')
     or (delivery_method = 'home_delivery' and address_snapshot is not null and pickup_snapshot is null and payment_method = 'cash_on_delivery')),
  check (total_paise = subtotal_paise - discount_paise + delivery_paise + tax_paise)
);
create index store_orders_user_placed_idx on public.store_orders(user_id, placed_at desc);
create index store_orders_status_idx on public.store_orders(fulfillment_status, placed_at desc);

create table public.store_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id),
  product_id uuid references public.store_products(id),
  variant_id uuid references public.store_product_variants(id),
  kit_id uuid references public.store_kits(id),
  kind text not null check (kind in ('product','kit')),
  name_snapshot text not null,
  variant_snapshot jsonb,
  components_snapshot jsonb,
  unit_snapshot text not null,
  quantity integer not null check (quantity between 1 and 100),
  unit_price_paise bigint not null check (unit_price_paise >= 0),
  discount_paise bigint not null default 0 check (discount_paise >= 0),
  tax_paise bigint not null default 0 check (tax_paise >= 0),
  line_total_paise bigint not null check (line_total_paise >= 0),
  check ((kind = 'product' and variant_id is not null and product_id is not null and kit_id is null)
     or (kind = 'kit' and kit_id is not null and product_id is null and variant_id is null))
);
create index store_order_items_order_idx on public.store_order_items(order_id);
create index store_order_items_variant_idx on public.store_order_items(variant_id);
create index store_order_items_kit_idx on public.store_order_items(kit_id);

create table public.store_order_stock (
  order_id uuid not null references public.store_orders(id),
  variant_id uuid not null references public.store_product_variants(id),
  quantity integer not null check (quantity > 0),
  primary key (order_id, variant_id)
);
create index store_order_stock_variant_idx on public.store_order_stock(variant_id);

create table public.store_inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.store_product_variants(id),
  order_id uuid references public.store_orders(id),
  delta_on_hand integer not null,
  delta_reserved integer not null default 0,
  reason text not null check (reason in ('receive','adjust','sale','cancel_release','reservation','reservation_release','return_restock')),
  actor_user_id uuid references auth.users(id),
  notes text,
  created_at timestamptz not null default now(),
  check (delta_on_hand <> 0 or delta_reserved <> 0)
);
create index store_inventory_movements_variant_created_idx on public.store_inventory_movements(variant_id, created_at desc);
create index store_inventory_movements_order_idx on public.store_inventory_movements(order_id);

create table public.store_order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id),
  previous_status text,
  new_status text not null,
  actor_user_id uuid references auth.users(id),
  notes text,
  created_at timestamptz not null default now()
);
create index store_order_status_history_order_idx on public.store_order_status_history(order_id, created_at);

create table public.store_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id),
  provider text not null check (provider in ('pay_at_pickup','cash_on_delivery','razorpay')),
  provider_reference text unique,
  amount_paise bigint not null check (amount_paise >= 0),
  currency text not null default 'INR' check (currency = 'INR'),
  state text not null default 'pending' check (state in ('pending','paid','failed','refunded')),
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index store_payments_order_idx on public.store_payments(order_id);

create table public.store_receipts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id),
  object_path text not null unique,
  file_name text not null,
  content_type text not null default 'application/pdf' check (content_type = 'application/pdf'),
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index store_receipts_order_idx on public.store_receipts(order_id);

-- All public-schema tables have RLS. Public data is read-only and only published
-- catalog records are visible through the Data API. Internal writes use trusted
-- server routes after verified Auth/admin checks.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'store_settings','store_categories','store_products','store_product_images',
    'store_product_variants','store_inventory','store_kits','store_kit_images',
    'store_kit_components','store_course_recommendations','store_student_links',
    'store_carts','store_cart_items','store_addresses','store_delivery_rules',
    'store_orders','store_order_items','store_order_stock',
    'store_inventory_movements','store_order_status_history','store_payments',
    'store_receipts'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
    execute format('grant all on public.%I to service_role', table_name);
  end loop;
end $$;

create policy store_categories_published_read on public.store_categories for select to anon, authenticated using (published);
create policy store_products_published_read on public.store_products for select to anon, authenticated using (published and archived_at is null and exists (select 1 from public.store_categories c where c.id = category_id and c.published));
create policy store_product_images_published_read on public.store_product_images for select to anon, authenticated using (exists (select 1 from public.store_products p where p.id = product_id and p.published and p.archived_at is null));
create policy store_variants_published_read on public.store_product_variants for select to anon, authenticated using (active and exists (select 1 from public.store_products p where p.id = product_id and p.published and p.archived_at is null));
create policy store_kits_published_read on public.store_kits for select to anon, authenticated using (published and archived_at is null);
create policy store_kit_images_published_read on public.store_kit_images for select to anon, authenticated using (exists (select 1 from public.store_kits k where k.id = kit_id and k.published and k.archived_at is null));
create policy store_kit_components_published_read on public.store_kit_components for select to anon, authenticated using (exists (select 1 from public.store_kits k where k.id = kit_id and k.published and k.archived_at is null));
create policy store_recommendations_published_read on public.store_course_recommendations for select to anon, authenticated using (
  (product_id is not null and exists (select 1 from public.store_products p where p.id = product_id and p.published and p.archived_at is null))
  or (kit_id is not null and exists (select 1 from public.store_kits k where k.id = kit_id and k.published and k.archived_at is null))
);

create policy store_student_links_own_read on public.store_student_links for select to authenticated using (user_id = (select auth.uid()));
create policy store_carts_own_read on public.store_carts for select to authenticated using (user_id = (select auth.uid()));
create policy store_cart_items_own_read on public.store_cart_items for select to authenticated using (exists (select 1 from public.store_carts c where c.id = cart_id and c.user_id = (select auth.uid())));
create policy store_addresses_own_read on public.store_addresses for select to authenticated using (user_id = (select auth.uid()));
create policy store_orders_own_read on public.store_orders for select to authenticated using (user_id = (select auth.uid()));
create policy store_order_items_own_read on public.store_order_items for select to authenticated using (exists (select 1 from public.store_orders o where o.id = order_id and o.user_id = (select auth.uid())));
create policy store_order_status_own_read on public.store_order_status_history for select to authenticated using (exists (select 1 from public.store_orders o where o.id = order_id and o.user_id = (select auth.uid())));
create policy store_receipts_own_read on public.store_receipts for select to authenticated using (exists (select 1 from public.store_orders o where o.id = order_id and o.user_id = (select auth.uid())));

grant select on public.store_categories, public.store_products, public.store_product_images,
  public.store_product_variants, public.store_kits, public.store_kit_images,
  public.store_kit_components, public.store_course_recommendations to anon, authenticated;
grant select on public.store_student_links, public.store_carts, public.store_cart_items,
  public.store_addresses, public.store_orders, public.store_order_items,
  public.store_order_status_history, public.store_receipts to authenticated;

-- Private media: the server uploads only after admin authorization and signs URLs
-- only for published catalog media or authorized order documents.
insert into storage.buckets (id, name, public) values
  ('store-images','store-images',false),
  ('store-documents','store-documents',false)
on conflict (id) do nothing;
