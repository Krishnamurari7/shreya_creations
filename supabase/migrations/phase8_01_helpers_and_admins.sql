-- Phase 8.2 / 8.3 — helpers, admins table, updated_at trigger
-- REVIEW BEFORE RUNNING. Safe to re-run (IF NOT EXISTS / OR REPLACE).

-- ---------------------------------------------------------------------------
-- updated_at trigger (reusable)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- admins — owner creates accounts; maps auth.users → admin role
-- Keeps existing public.users intact (quiz feature).
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id    uuid unique references auth.users (id) on delete cascade,
  email      text not null,
  role       text not null default 'editor' check (role in ('owner', 'editor'))
);

drop trigger if exists admins_set_updated_at on public.admins;
create trigger admins_set_updated_at
  before update on public.admins
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- is_admin() — security definer, locked search_path
-- Checks admins table first; falls back to legacy public.users.role = 'admin'
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where a.user_id = auth.uid()
  )
  or exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'admin'
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where a.user_id = auth.uid() and a.role = 'owner'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_owner() to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Bootstrap first owner — TODO(owner): confirm email before running in prod
-- Inserts only if no owner exists yet.
-- ---------------------------------------------------------------------------
insert into public.admins (user_id, email, role)
select u.id, u.email, 'owner'
from auth.users u
where u.email = 'krishna@aa100xtech.com'
  and not exists (select 1 from public.admins where role = 'owner')
on conflict (user_id) do update set role = 'owner', email = excluded.email;

alter table public.admins enable row level security;
