-- Phase 8.4 — documents bucket (private) + tighten storage policies
-- REVIEW BEFORE RUNNING.

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do update set public = false;

-- Drop legacy permissive storage policies (media only)
drop policy if exists "public read media" on storage.objects;
drop policy if exists "authenticated upload media" on storage.objects;
drop policy if exists "authenticated update media" on storage.objects;
drop policy if exists "authenticated delete media" on storage.objects;

-- Public read: media bucket only
create policy "anon read media objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Admin write: both buckets
create policy "admin insert storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('media', 'documents') and public.is_admin());

create policy "admin update storage"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('media', 'documents') and public.is_admin())
  with check (bucket_id in ('media', 'documents') and public.is_admin());

create policy "admin delete storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('media', 'documents') and public.is_admin());

-- Admin read documents (signed URLs still preferred for anon)
create policy "admin read documents"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'documents' and public.is_admin());
