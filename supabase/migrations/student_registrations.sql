-- Student admission / registration form submissions
-- Run in Supabase SQL Editor or via supabase db push

create table if not exists public.student_registrations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Personal details
  name            text not null,
  phone           text not null,
  email           text,
  date_of_birth   date,
  gender          text,
  address         text,
  city            text default 'Patna',

  -- Course & batch
  course_id       uuid references public.courses(id) on delete set null,
  course_name     text not null,
  course_slug     text,
  preferred_batch text,

  -- Background
  education       text,
  guardian_name   text,
  aadhaar_last4   text,
  referral_source text,
  message         text,

  -- Meta
  locale          text default 'en',
  source_page     text,
  status          text not null default 'pending',
  admission_number text,
  is_read         boolean not null default false,
  notes           text,

  constraint student_registrations_status_check
    check (status in ('pending', 'reviewed', 'admitted', 'rejected'))
);

create index if not exists student_registrations_created_at_idx
  on public.student_registrations (created_at desc);

create index if not exists student_registrations_status_idx
  on public.student_registrations (status);

alter table public.student_registrations enable row level security;

-- Anon can INSERT only (public form); admin can SELECT/UPDATE/DELETE
create policy "registrations_public_insert"
  on public.student_registrations for insert
  to anon
  with check (true);

create policy "registrations_admin_select"
  on public.student_registrations for select
  to authenticated
  using (public.is_admin());

create policy "registrations_admin_update"
  on public.student_registrations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "registrations_admin_delete"
  on public.student_registrations for delete
  to authenticated
  using (public.is_admin());

revoke select on public.student_registrations from anon;

grant insert on public.student_registrations to anon;
grant select, insert, update, delete on public.student_registrations to authenticated;
