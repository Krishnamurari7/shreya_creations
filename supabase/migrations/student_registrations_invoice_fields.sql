-- Extend student_registrations for full tax-invoice admission form fields
-- Safe to re-run: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS

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
