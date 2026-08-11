-- Phase 8.2 — extend existing tables (do NOT drop/rename)
-- Maps Phase 8 spec fields onto current schema.
-- REVIEW BEFORE RUNNING.

-- ---------------------------------------------------------------------------
-- settings (= site_settings in spec — single row id=1)
-- ---------------------------------------------------------------------------
alter table public.settings add column if not exists course_count int;
alter table public.settings add column if not exists announcement_text_en text;
alter table public.settings add column if not exists announcement_text_hi text;
alter table public.settings add column if not exists next_batch_date date;
alter table public.settings add column if not exists next_batch_seats int;
alter table public.settings add column if not exists fee_structure_pdf text;

-- Backfill stats from confirmed business facts where null
update public.settings set
  founding_year = coalesce(founding_year, 2012),
  students_taught = coalesce(students_taught, 2000),
  outfits_delivered = coalesce(outfits_delivered, 5000),
  phone_primary = coalesce(phone_primary, phone, '+91 90311 05666'),
  phone_secondary = coalesce(phone_secondary, '+91 79031 55125'),
  whatsapp_number = coalesce(whatsapp_number, whatsapp, '919031105666'),
  email = coalesce(email, 'hello@shreyacreation.com'),
  address_line = coalesce(address_line, address, 'Sisodiya Place, East Boring Canal Road, Patna, Bihar 800001, IN'),
  studio_hours = coalesce(studio_hours, 'Mon-Sat, 10 AM - 8 PM'),
  closed_days = coalesce(closed_days, 'Sunday'),
  course_count = coalesce(course_count, 10)
where id = 1;

-- ---------------------------------------------------------------------------
-- courses — extend for bilingual admin + batches urgency
-- ---------------------------------------------------------------------------
alter table public.courses add column if not exists days_per_week text;
alter table public.courses add column if not exists level text;
alter table public.courses add column if not exists starting_from boolean default true;
alter table public.courses add column if not exists features jsonb default '[]'::jsonb;
alter table public.courses add column if not exists hero_image text;
alter table public.courses add column if not exists gallery jsonb default '[]'::jsonb;
alter table public.courses add column if not exists sort_order int default 0;
alter table public.courses add column if not exists seo_title text;
alter table public.courses add column if not exists seo_description text;

update public.courses set hero_image = coalesce(hero_image, image) where hero_image is null and image is not null;
update public.courses set seo_title = coalesce(seo_title, meta_title) where seo_title is null;
update public.courses set seo_description = coalesce(seo_description, meta_description) where seo_description is null;
update public.courses set features = coalesce(includes, '[]'::jsonb) where features = '[]'::jsonb or features is null;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
alter table public.products add column if not exists name_en text;
alter table public.products add column if not exists name_hi text;
alter table public.products add column if not exists description_en text;
alter table public.products add column if not exists description_hi text;
alter table public.products add column if not exists is_ready_made boolean default false;
alter table public.products add column if not exists sort_order int default 0;

update public.products set name_en = coalesce(name_en, title) where name_en is null;
update public.products set description_en = coalesce(description_en, description) where description_en is null;
update public.products set is_ready_made = coalesce(ready_made, is_ready_made, false);

-- ---------------------------------------------------------------------------
-- portfolio
-- ---------------------------------------------------------------------------
alter table public.portfolio add column if not exists title_en text;
alter table public.portfolio add column if not exists title_hi text;
alter table public.portfolio add column if not exists description text;
alter table public.portfolio add column if not exists images jsonb default '[]'::jsonb;
alter table public.portfolio add column if not exists is_published boolean default true;

update public.portfolio set title_en = coalesce(title_en, title, caption) where title_en is null;
update public.portfolio set images = case
  when image is not null and (images is null or images = '[]'::jsonb) then jsonb_build_array(image)
  else coalesce(images, '[]'::jsonb)
end;

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
alter table public.testimonials add column if not exists author_name text;
alter table public.testimonials add column if not exists quote_en text;
alter table public.testimonials add column if not exists quote_hi text;
alter table public.testimonials add column if not exists source_url text;
alter table public.testimonials add column if not exists type text default 'boutique';
alter table public.testimonials add column if not exists is_published boolean default true;
alter table public.testimonials add column if not exists sort_order int default 0;

update public.testimonials set author_name = coalesce(author_name, name) where author_name is null;
update public.testimonials set quote_en = coalesce(quote_en, text) where quote_en is null;
update public.testimonials set source_url = coalesce(source_url, review_url) where source_url is null;
update public.testimonials set type = coalesce(category, type, 'boutique');

-- ---------------------------------------------------------------------------
-- lookbook_posts (= blog_posts in spec)
-- ---------------------------------------------------------------------------
alter table public.lookbook_posts add column if not exists locale text default 'en' check (locale in ('en', 'hi'));
alter table public.lookbook_posts add column if not exists author text;
alter table public.lookbook_posts add column if not exists published_at timestamptz;
alter table public.lookbook_posts add column if not exists cover_image text;
alter table public.lookbook_posts add column if not exists seo_title text;
alter table public.lookbook_posts add column if not exists seo_description text;

update public.lookbook_posts set cover_image = coalesce(cover_image, image) where cover_image is null;
update public.lookbook_posts set seo_title = coalesce(seo_title, meta_title) where seo_title is null;
update public.lookbook_posts set seo_description = coalesce(seo_description, meta_description) where seo_description is null;
update public.lookbook_posts set published_at = coalesce(published_at, created_at) where published_at is null;

-- ---------------------------------------------------------------------------
-- contact_inquiries (= enquiries in spec)
-- ---------------------------------------------------------------------------
alter table public.contact_inquiries add column if not exists email text;
alter table public.contact_inquiries add column if not exists source_page text;
alter table public.contact_inquiries add column if not exists inquiry_type text default 'contact';
alter table public.contact_inquiries add column if not exists locale text default 'en';
alter table public.contact_inquiries add column if not exists is_read boolean default false;
alter table public.contact_inquiries add column if not exists notes text;
alter table public.contact_inquiries add column if not exists updated_at timestamptz default now();

update public.contact_inquiries set inquiry_type = case
  when source ilike '%demo%' then 'demo'
  when source ilike '%brochure%' or source ilike '%fee%' then 'brochure'
  when source ilike '%order%' or source ilike '%shop%' then 'order'
  else coalesce(inquiry_type, 'contact')
end where inquiry_type is null or inquiry_type = 'contact';

-- updated_at triggers on tables that lack them
do $$
declare t text;
begin
  foreach t in array array[
    'products','courses','portfolio','testimonials','lookbook_posts','contact_inquiries'
  ] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end $$;
