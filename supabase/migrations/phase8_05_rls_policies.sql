-- Phase 8.3 — Row Level Security (replace permissive authenticated policies)
-- REVIEW BEFORE RUNNING. Does NOT drop tables.
-- Run AFTER phase8_01 through phase8_04.

-- ---------------------------------------------------------------------------
-- Drop legacy public-schema policies (core CMS tables)
-- ---------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'settings','products','courses','portfolio','testimonials',
        'trust_stats','faqs','policy_pages','lookbook_posts','contact_inquiries','admins'
      )
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- admins — owner read/write all; editors read self
-- ---------------------------------------------------------------------------
create policy "admins_select_self_or_owner"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid() or public.is_owner());

create policy "admins_insert_owner"
  on public.admins for insert
  to authenticated
  with check (public.is_owner());

create policy "admins_update_owner"
  on public.admins for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

create policy "admins_delete_owner"
  on public.admins for delete
  to authenticated
  using (public.is_owner());

-- ---------------------------------------------------------------------------
-- settings — public read; admin write
-- ---------------------------------------------------------------------------
create policy "settings_public_read"
  on public.settings for select
  to anon, authenticated
  using (true);

create policy "settings_admin_write"
  on public.settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
create policy "courses_public_read"
  on public.courses for select
  to anon, authenticated
  using (published = true or public.is_admin());

create policy "courses_admin_insert"
  on public.courses for insert
  to authenticated
  with check (public.is_admin());

create policy "courses_admin_update"
  on public.courses for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "courses_admin_delete"
  on public.courses for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (published = true or public.is_admin());

create policy "products_admin_insert"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- portfolio
-- ---------------------------------------------------------------------------
create policy "portfolio_public_read"
  on public.portfolio for select
  to anon, authenticated
  using (coalesce(is_published, true) = true or public.is_admin());

create policy "portfolio_admin_insert"
  on public.portfolio for insert
  to authenticated
  with check (public.is_admin());

create policy "portfolio_admin_update"
  on public.portfolio for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "portfolio_admin_delete"
  on public.portfolio for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create policy "testimonials_public_read"
  on public.testimonials for select
  to anon, authenticated
  using (coalesce(is_published, true) = true or public.is_admin());

create policy "testimonials_admin_insert"
  on public.testimonials for insert
  to authenticated
  with check (public.is_admin());

create policy "testimonials_admin_update"
  on public.testimonials for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "testimonials_admin_delete"
  on public.testimonials for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- lookbook_posts
-- ---------------------------------------------------------------------------
create policy "lookbook_public_read"
  on public.lookbook_posts for select
  to anon, authenticated
  using (published = true or public.is_admin());

create policy "lookbook_admin_insert"
  on public.lookbook_posts for insert
  to authenticated
  with check (public.is_admin());

create policy "lookbook_admin_update"
  on public.lookbook_posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "lookbook_admin_delete"
  on public.lookbook_posts for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- trust_stats, faqs, policy_pages
-- ---------------------------------------------------------------------------
create policy "trust_stats_public_read"
  on public.trust_stats for select
  to anon, authenticated
  using (published = true or public.is_admin());

create policy "trust_stats_admin_write"
  on public.trust_stats for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "faqs_public_read"
  on public.faqs for select
  to anon, authenticated
  using (published = true or public.is_admin());

create policy "faqs_admin_write"
  on public.faqs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "policy_pages_public_read"
  on public.policy_pages for select
  to anon, authenticated
  using (true);

create policy "policy_pages_admin_write"
  on public.policy_pages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- batches
-- ---------------------------------------------------------------------------
create policy "batches_public_read"
  on public.batches for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

create policy "batches_admin_write"
  on public.batches for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- media_library
-- ---------------------------------------------------------------------------
create policy "media_library_admin_all"
  on public.media_library for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- contact_inquiries — anon INSERT only; admin SELECT/UPDATE/DELETE
-- ---------------------------------------------------------------------------
create policy "enquiries_public_insert"
  on public.contact_inquiries for insert
  to anon
  with check (true);

create policy "enquiries_admin_select"
  on public.contact_inquiries for select
  to authenticated
  using (public.is_admin());

create policy "enquiries_admin_update"
  on public.contact_inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "enquiries_admin_delete"
  on public.contact_inquiries for delete
  to authenticated
  using (public.is_admin());

revoke select on public.contact_inquiries from anon;
