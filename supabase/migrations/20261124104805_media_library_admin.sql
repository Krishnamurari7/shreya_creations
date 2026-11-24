-- Add the Media Library metadata table used by Admin > Media and the home awards picker.
-- Existing media bucket files remain untouched.

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  file_path text not null,
  public_url text not null,
  alt_text_en text,
  alt_text_hi text,
  width int,
  height int,
  uploaded_by uuid references auth.users (id) on delete set null
);

create index if not exists media_library_file_path_idx
  on public.media_library (file_path);

alter table public.media_library enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'media_library'
      and policyname = 'media_library_admin_all'
  ) then
    create policy "media_library_admin_all"
      on public.media_library for all
      to authenticated
      using ((select public.is_admin()))
      with check ((select public.is_admin()));
  end if;
end $$;

grant select, insert, update, delete on public.media_library to authenticated, service_role;
