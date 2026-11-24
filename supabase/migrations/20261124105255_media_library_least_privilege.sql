-- Limit the Media Library Data API surface to admin-authenticated writes.
revoke all privileges on public.media_library from anon, authenticated, service_role;
grant select, insert, update, delete on public.media_library to authenticated, service_role;

create index if not exists media_library_uploaded_by_idx
  on public.media_library (uploaded_by);
