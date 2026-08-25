-- Explicit Coming Soon / Enroll control for courses admin
alter table public.courses
  add column if not exists coming_soon boolean not null default true;

comment on column public.courses.coming_soon is
  'When true, public site shows Coming Soon instead of Enroll Now.';

-- Backfill from previous auto-rule: enrollable only when PDF + (about or includes)
update public.courses
set coming_soon = not (
  coalesce(nullif(trim(course_pdf), ''), null) is not null
  and (
    coalesce(nullif(trim(about), ''), null) is not null
    or (
      includes is not null
      and jsonb_typeof(includes) = 'array'
      and jsonb_array_length(includes) > 0
    )
  )
);
