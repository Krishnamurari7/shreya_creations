-- Testimonials: drop the remote Unsplash stock portraits in favour of initials
-- avatars rendered client-side, and record which entries actually originate
-- from the Google Business profile.
--
-- `source` gates the "Verified Google Review" badge: only rows explicitly
-- marked 'google' may claim verification, so seeded/manual entries can never
-- be presented to visitors as real Google reviews.

alter table public.testimonials
  add column if not exists source text not null default 'manual',
  add column if not exists review_url text;

alter table public.testimonials
  drop constraint if exists testimonials_source_check;

alter table public.testimonials
  add constraint testimonials_source_check check (source in ('manual', 'google'));

update public.testimonials
set photo = null
where photo ilike '%unsplash.com%';

-- Public link to the Google Business profile reviews tab. The homepage CTA
-- stays hidden until a real URL is set here.
alter table public.settings
  add column if not exists google_reviews_url text;
