-- Add passport photo URL for admission form uploads
-- Safe to re-run

alter table public.student_registrations
  add column if not exists passport_photo_url text;
