-- Admin-only check before removing an image from the public media bucket.
-- Search saved site content, including JSON fields, without exposing row data.
create or replace function public.media_asset_references(p_url text, p_path text)
returns text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  column_row record;
  found boolean;
  used_tables text[] := array[]::text[];
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if coalesce(length(p_url), 0) = 0 or coalesce(length(p_path), 0) = 0 then
    raise exception 'Image URL and path are required' using errcode = '22023';
  end if;

  for column_row in
    select c.table_name, c.column_name
    from information_schema.columns c
    join information_schema.tables t
      on t.table_schema = c.table_schema and t.table_name = c.table_name
    where c.table_schema = 'public'
      and t.table_type = 'BASE TABLE'
      and c.table_name <> 'media_library'
      and c.data_type in ('text', 'character varying', 'json', 'jsonb', 'ARRAY')
    order by c.table_name, c.ordinal_position
  loop
    if column_row.table_name = any(used_tables) then
      continue;
    end if;

    execute format(
      'select exists (select 1 from public.%I where position($1 in %I::text) > 0 or position($2 in %I::text) > 0)',
      column_row.table_name,
      column_row.column_name,
      column_row.column_name
    ) using p_url, p_path into found;

    if found then
      used_tables := array_append(used_tables, column_row.table_name);
    end if;
  end loop;

  return used_tables;
end;
$$;

revoke all on function public.media_asset_references(text, text) from public, anon;
grant execute on function public.media_asset_references(text, text) to authenticated;
