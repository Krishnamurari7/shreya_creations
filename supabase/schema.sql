-- =============================================================
-- Shreya Creations — Supabase schema (full)
-- Run in Supabase SQL Editor or via MCP apply_migration
-- =============================================================

create table if not exists public.settings (
  id               int primary key default 1,
  brand            text,
  boutique         text,
  boutique_hi      text,
  tagline          text,
  tagline_hi       text,
  intro            text,
  intro_hi         text,
  about_body       text,
  about_body_hi    text,
  about_pillars    jsonb default '[]'::jsonb,
  whatsapp         text,
  whatsapp_number  text,
  phone            text,
  phone_primary    text,
  phone_secondary  text,
  email            text,
  address          text,
  address_line     text,
  city             text,
  pincode          text,
  founded          text,
  founding_year    int default 2012,
  students_taught  int default 2000,
  outfits_delivered int default 5000,
  express_delivery_hours int default 24,
  studio_hours     text,
  closed_days      text,
  map_embed_url    text,
  socials          jsonb default '{}'::jsonb,
  services         jsonb default '[]'::jsonb,
  process_steps    jsonb default '[]'::jsonb,
  hero_marquee     jsonb default '[]'::jsonb,
  instagram_embed  text,
  default_language text default 'en',
  pages            jsonb not null default '{}'::jsonb,
  updated_at       timestamptz default now()
);

create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  title         text not null,
  slug          text unique not null,
  category      text,
  price         numeric,
  fabric        text,
  sizes         text,
  care          text,
  colours       text,
  estimated_delivery text,
  description   text,
  description_long text,
  images        jsonb default '[]'::jsonb,
  whatsapp_text text,
  stitchable    boolean default false,
  published     boolean default true,
  meta_title    text,
  meta_description text,
  og_image      text,
  image_alt     text,
  focus_keyword text
);

-- If courses table already exists without newer columns, run once in SQL Editor:
-- (see supabase/migrations/courses_extend.sql)

create table if not exists public.courses (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  title           text not null,
  title_hi        text,
  slug            text unique not null,
  category        text,
  price           numeric,
  compare_price   numeric,
  duration        text,
  language        text,
  description     text,
  description_hi  text,
  about           text,
  about_hi        text,
  includes        jsonb default '[]'::jsonb,
  includes_hi     jsonb default '[]'::jsonb,
  syllabus        jsonb default '[]'::jsonb,
  course_pdf      text,
  is_addon        boolean default false,
  badge           text,
  image           text,
  preview_video   text,
  published       boolean default true,
  meta_title      text,
  meta_description text,
  og_image        text,
  image_alt       text,
  focus_keyword   text
);

create table if not exists public.portfolio (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  title       text,
  caption     text,
  category    text,
  image       text,
  slug        text,
  sort_order  int default 0,
  meta_title  text,
  meta_description text,
  og_image    text,
  image_alt   text,
  focus_keyword text
);

create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  name        text,
  text        text,
  rating      int default 5,
  photo       text,
  video_url   text
);

create table if not exists public.trust_stats (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  label_hi    text,
  value       text not null,
  value_hi    text,
  sort_order  int default 0,
  published   boolean default true
);

-- If trust_stats already exists without value_hi, run once in SQL Editor:
-- alter table public.trust_stats add column if not exists value_hi text;

create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  question_hi text,
  answer      text not null,
  answer_hi   text,
  sort_order  int default 0,
  published   boolean default true
);

create table if not exists public.policy_pages (
  slug        text primary key,
  title       text not null,
  title_hi    text,
  body        text not null,
  body_hi     text,
  updated_at  timestamptz default now()
);

create table if not exists public.lookbook_posts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  title       text not null,
  slug        text unique not null,
  excerpt     text,
  image       text,
  published   boolean default true
);

create table if not exists public.contact_inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  name        text,
  phone       text,
  message     text,
  source      text default 'contact_form',
  preferred_date date
);

alter table public.contact_inquiries add column if not exists phone text;
alter table public.contact_inquiries add column if not exists preferred_date date;

-- API roles must have table grants (RLS alone is not enough)
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- RLS
alter table public.settings enable row level security;
alter table public.products enable row level security;
alter table public.courses enable row level security;
alter table public.portfolio enable row level security;
alter table public.testimonials enable row level security;
alter table public.trust_stats enable row level security;
alter table public.faqs enable row level security;
alter table public.policy_pages enable row level security;
alter table public.lookbook_posts enable row level security;
alter table public.contact_inquiries enable row level security;

create policy "public read settings" on public.settings for select using (true);
create policy "public read portfolio" on public.portfolio for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read trust_stats" on public.trust_stats for select using (published = true);
create policy "public read faqs" on public.faqs for select using (published = true);
create policy "public read policy_pages" on public.policy_pages for select using (true);
create policy "public read lookbook" on public.lookbook_posts for select using (published = true);

create policy "anon read published products" on public.products for select to anon using (published = true);
create policy "authenticated read products" on public.products for select to authenticated using (true);
create policy "authenticated insert products" on public.products for insert to authenticated with check (true);
create policy "authenticated update products" on public.products for update to authenticated using (true) with check (true);
create policy "authenticated delete products" on public.products for delete to authenticated using (true);

create policy "anon read published courses" on public.courses for select to anon using (published = true);
create policy "authenticated read courses" on public.courses for select to authenticated using (true);
create policy "authenticated insert courses" on public.courses for insert to authenticated with check (true);
create policy "authenticated update courses" on public.courses for update to authenticated using (true) with check (true);
create policy "authenticated delete courses" on public.courses for delete to authenticated using (true);

create policy "authenticated write settings" on public.settings for all to authenticated using (true) with check (true);
create policy "authenticated write portfolio" on public.portfolio for all to authenticated using (true) with check (true);
create policy "authenticated write testimonials" on public.testimonials for all to authenticated using (true) with check (true);
create policy "authenticated write trust_stats" on public.trust_stats for all to authenticated using (true) with check (true);
create policy "authenticated write faqs" on public.faqs for all to authenticated using (true) with check (true);
create policy "authenticated write policy_pages" on public.policy_pages for all to authenticated using (true) with check (true);
create policy "authenticated write lookbook" on public.lookbook_posts for all to authenticated using (true) with check (true);
create policy "admin read inquiries" on public.contact_inquiries for select to authenticated using (true);
create policy "public insert inquiries" on public.contact_inquiries for insert with check (true);

insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "authenticated upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "authenticated update media" on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "authenticated delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');
