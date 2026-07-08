-- Run once in Supabase SQL Editor if your courses table was created from an older schema.sql
alter table public.courses add column if not exists title_hi text;
alter table public.courses add column if not exists compare_price numeric;
alter table public.courses add column if not exists description_hi text;
alter table public.courses add column if not exists about text;
alter table public.courses add column if not exists about_hi text;
alter table public.courses add column if not exists includes jsonb default '[]'::jsonb;
alter table public.courses add column if not exists includes_hi jsonb default '[]'::jsonb;
alter table public.courses add column if not exists course_pdf text;
alter table public.courses add column if not exists is_addon boolean default false;
alter table public.courses add column if not exists badge text;
