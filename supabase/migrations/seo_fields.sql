-- SEO fields for courses, products, and portfolio
-- Safe to re-run (IF NOT EXISTS). Apply in Supabase SQL Editor or via MCP.

alter table public.courses add column if not exists meta_title text;
alter table public.courses add column if not exists meta_description text;
alter table public.courses add column if not exists og_image text;
alter table public.courses add column if not exists image_alt text;
alter table public.courses add column if not exists focus_keyword text;
alter table public.courses add column if not exists updated_at timestamptz default now();

alter table public.products add column if not exists meta_title text;
alter table public.products add column if not exists meta_description text;
alter table public.products add column if not exists og_image text;
alter table public.products add column if not exists image_alt text;
alter table public.products add column if not exists focus_keyword text;
alter table public.products add column if not exists updated_at timestamptz default now();

alter table public.portfolio add column if not exists slug text;
alter table public.portfolio add column if not exists meta_title text;
alter table public.portfolio add column if not exists meta_description text;
alter table public.portfolio add column if not exists og_image text;
alter table public.portfolio add column if not exists image_alt text;
alter table public.portfolio add column if not exists focus_keyword text;
alter table public.portfolio add column if not exists caption text;
alter table public.portfolio add column if not exists updated_at timestamptz default now();

-- Backfill readable portfolio slugs for existing rows without one
update public.portfolio
set slug = trim(both '-' from regexp_replace(lower(coalesce(title, 'portfolio-' || id::text)), '[^a-z0-9]+', '-', 'g'))
where slug is null or btrim(slug) = '';

-- De-duplicate slugs (e.g. two rows titled "News" → news, news-2, news-3 …)
with ranked as (
  select id, slug,
         row_number() over (partition by slug order by sort_order, created_at, id) as rn
  from public.portfolio
  where slug is not null and btrim(slug) <> ''
)
update public.portfolio p
set slug = p.slug || '-' || r.rn
from ranked r
where p.id = r.id and r.rn > 1;

-- Unique slug when present (allows nulls for unfinished drafts)
create unique index if not exists portfolio_slug_unique on public.portfolio (slug)
  where slug is not null and btrim(slug) <> '';
