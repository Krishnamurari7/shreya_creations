-- Complete setup for student admission / enrollment registrations
-- Run once in Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run

create table if not exists public.student_registrations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  name            text not null,
  phone           text not null,
  email           text,
  date_of_birth   date,
  gender          text,
  address         text,
  city            text default 'Patna',

  course_id       uuid,
  course_name     text not null,
  course_slug     text,
  preferred_batch text,

  education       text,
  guardian_name   text,
  aadhaar_last4   text,
  referral_source text,
  message         text,

  locale          text default 'en',
  source_page     text,
  status          text not null default 'pending',
  admission_number text,
  is_read         boolean not null default false,
  notes           text,

  constraint student_registrations_status_check
    check (status in ('pending', 'reviewed', 'admitted', 'rejected'))
);

-- Enrollment / form extras
alter table public.student_registrations
  add column if not exists whatsapp_phone text,
  add column if not exists district text,
  add column if not exists state text,
  add column if not exists pin_code text,
  add column if not exists course_mode text,
  add column if not exists fee_discount numeric,
  add column if not exists experience text,
  add column if not exists sewing_machine text,
  add column if not exists previous_training text,
  add column if not exists documents_submitted text,
  add column if not exists passport_photo_url text;

-- Invoice / fee fields
alter table public.student_registrations
  add column if not exists invoice_no text,
  add column if not exists form_date date,
  add column if not exists course_code text,
  add column if not exists duration_months text,
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists fee_course numeric,
  add column if not exists fee_registration numeric,
  add column if not exists fee_material numeric,
  add column if not exists fee_gst_percent numeric,
  add column if not exists fee_gst_amount numeric,
  add column if not exists fee_total numeric,
  add column if not exists installment_1_due date,
  add column if not exists installment_1_amount numeric,
  add column if not exists installment_1_paid boolean default false,
  add column if not exists installment_2_due date,
  add column if not exists installment_2_amount numeric,
  add column if not exists installment_2_paid boolean default false,
  add column if not exists installment_3_due date,
  add column if not exists installment_3_amount numeric,
  add column if not exists installment_3_paid boolean default false,
  add column if not exists payment_mode text,
  add column if not exists amount_received numeric,
  add column if not exists payment_received_date date,
  add column if not exists received_by text;

create index if not exists student_registrations_created_at_idx
  on public.student_registrations (created_at desc);

create index if not exists student_registrations_status_idx
  on public.student_registrations (status);

alter table public.student_registrations enable row level security;

drop policy if exists "registrations_public_insert" on public.student_registrations;
create policy "registrations_public_insert"
  on public.student_registrations for insert
  to anon
  with check (true);

drop policy if exists "registrations_admin_select" on public.student_registrations;
create policy "registrations_admin_select"
  on public.student_registrations for select
  to authenticated
  using (public.is_admin());

drop policy if exists "registrations_admin_update" on public.student_registrations;
create policy "registrations_admin_update"
  on public.student_registrations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "registrations_admin_delete" on public.student_registrations;
create policy "registrations_admin_delete"
  on public.student_registrations for delete
  to authenticated
  using (public.is_admin());

revoke select on public.student_registrations from anon;
grant insert on public.student_registrations to anon;
grant select, insert, update, delete on public.student_registrations to authenticated;
