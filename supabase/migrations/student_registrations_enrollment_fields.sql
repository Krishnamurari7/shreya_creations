-- Extend student_registrations for admission / enrollment form fields
-- Safe to re-run: uses ADD COLUMN IF NOT EXISTS

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
