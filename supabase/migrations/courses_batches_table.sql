-- Courses admin: batches table for next-batch urgency banner.
-- Applied remotely; kept in repo for local / future environments.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.batches (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  course_id   uuid references public.courses (id) on delete cascade,
  start_date  date not null,
  seats_total int not null default 20,
  seats_left  int not null default 20,
  is_active   boolean not null default true
);

drop trigger if exists batches_set_updated_at on public.batches;
create trigger batches_set_updated_at
  before update on public.batches
  for each row execute function public.set_updated_at();

create index if not exists batches_course_id_idx on public.batches (course_id);
create index if not exists batches_start_date_idx on public.batches (start_date);

alter table public.batches enable row level security;

drop policy if exists "batches_public_read" on public.batches;
create policy "batches_public_read"
  on public.batches for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "batches_admin_write" on public.batches;
create policy "batches_admin_write"
  on public.batches for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
