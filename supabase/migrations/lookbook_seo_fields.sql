-- SEO + article body fields for blog (lookbook_posts)
-- Safe to re-run (IF NOT EXISTS). Apply in Supabase SQL Editor.

alter table public.lookbook_posts add column if not exists body text;
alter table public.lookbook_posts add column if not exists body_hi text;
alter table public.lookbook_posts add column if not exists meta_title text;
alter table public.lookbook_posts add column if not exists meta_description text;
alter table public.lookbook_posts add column if not exists og_image text;
alter table public.lookbook_posts add column if not exists image_alt text;
alter table public.lookbook_posts add column if not exists focus_keyword text;
alter table public.lookbook_posts add column if not exists updated_at timestamptz default now();
