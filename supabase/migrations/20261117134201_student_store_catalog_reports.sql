-- Server-only catalog pagination and accurate sales reporting.
create function public.store_catalog_product_ids(
  p_search text default null,
  p_category_slug text default null,
  p_course_id uuid default null,
  p_min_price bigint default null,
  p_max_price bigint default null,
  p_stock_only boolean default false,
  p_sort text default 'newest',
  p_limit integer default 12,
  p_offset integer default 0
) returns table(product_id uuid, min_price_paise bigint, total_count bigint)
language sql stable security definer set search_path = '' as $$
  with variant_summary as (
    select v.product_id, min(v.price_paise) as min_price,
      sum(greatest(coalesce(i.on_hand,0)-coalesce(i.reserved,0),0)) as available
    from public.store_product_variants v
    left join public.store_inventory i on i.variant_id=v.id
    where v.active and v.tax_rate_bps is not null
    group by v.product_id
  ), filtered as (
    select p.id,p.created_at,s.min_price,s.available
    from public.store_products p
    join public.store_categories c on c.id=p.category_id
    join variant_summary s on s.product_id=p.id
    where p.published and p.archived_at is null and c.published
      and (nullif(p_search,'') is null or p.name ilike '%' || p_search || '%')
      and (nullif(p_category_slug,'') is null or c.slug=p_category_slug)
      and (p_course_id is null or exists (
        select 1 from public.store_course_recommendations r
        where r.course_id=p_course_id and r.product_id=p.id
      ))
      and (p_min_price is null or s.min_price >= p_min_price)
      and (p_max_price is null or s.min_price <= p_max_price)
      and (not coalesce(p_stock_only,false) or s.available > 0)
  )
  select f.id,f.min_price,count(*) over() as total_count
  from filtered f
  order by
    case when p_sort='price_asc' then f.min_price end asc nulls last,
    case when p_sort='price_desc' then f.min_price end desc nulls last,
    f.created_at desc,f.id
  limit least(greatest(coalesce(p_limit,12),1),50)
  offset greatest(coalesce(p_offset,0),0);
$$;
revoke all on function public.store_catalog_product_ids(text,text,uuid,bigint,bigint,boolean,text,integer,integer) from public, anon, authenticated;
grant execute on function public.store_catalog_product_ids(text,text,uuid,bigint,bigint,boolean,text,integer,integer) to service_role;

create function public.store_report_summary(p_from timestamptz default null,p_to timestamptz default null)
returns jsonb language sql stable security definer set search_path = '' as $$
  select pg_catalog.jsonb_build_object(
    'order_count',count(*),
    'paid_order_count',count(*) filter (where payment_state='paid'),
    'paid_revenue_paise',coalesce(sum(total_paise) filter (where payment_state='paid'),0),
    'pending_paise',coalesce(sum(total_paise) filter (where payment_state='pending'),0),
    'cancelled_count',count(*) filter (where fulfillment_status='cancelled'),
    'out_of_stock_variants',(select count(*) from public.store_inventory i where i.on_hand-i.reserved <= 0)
  ) from public.store_orders
    where (p_from is null or placed_at >= p_from)
      and (p_to is null or placed_at < p_to);
$$;
revoke all on function public.store_report_summary(timestamptz,timestamptz) from public, anon, authenticated;
grant execute on function public.store_report_summary(timestamptz,timestamptz) to service_role;
