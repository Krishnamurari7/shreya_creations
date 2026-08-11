-- Phase 8.2 — new tables: batches, media_library
-- REVIEW BEFORE RUNNING.

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

create table if not exists public.media_library (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  file_path    text not null,
  public_url   text not null,
  alt_text_en  text,
  alt_text_hi  text,
  width        int,
  height       int,
  uploaded_by  uuid references auth.users (id) on delete set null
);

drop trigger if exists media_library_set_updated_at on public.media_library;
create trigger media_library_set_updated_at
  before update on public.media_library
  for each row execute function public.set_updated_at();

create index if not exists media_library_file_path_idx on public.media_library (file_path);

alter table public.batches enable row level security;
alter table public.media_library enable row level security;
