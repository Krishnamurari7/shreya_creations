-- Studio coordinates for LocalBusiness JSON-LD (optional until confirmed from GBP).
alter table public.settings add column if not exists geo_lat double precision;
alter table public.settings add column if not exists geo_lng double precision;

comment on column public.settings.geo_lat is
  'Studio latitude from Google Business Profile pin — leave null until confirmed';
comment on column public.settings.geo_lng is
  'Studio longitude from Google Business Profile pin — leave null until confirmed';
