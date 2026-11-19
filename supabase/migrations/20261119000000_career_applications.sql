-- Direct internship and job applications for Shreya Creation.
create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null,
  phone text not null,
  opportunity text not null check (opportunity in ('Internship', 'Job')),
  preferred_role text not null,
  city text not null,
  experience text,
  portfolio_url text,
  message text,
  resume_path text not null unique,
  resume_filename text not null,
  resume_mime text not null check (resume_mime in ('application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')),
  consent_to_process_at timestamptz not null,
  status text not null default 'New' check (status in ('New', 'Reviewing', 'Interview', 'Selected', 'Rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists career_applications_created_idx on public.career_applications(created_at desc);
create index if not exists career_applications_status_idx on public.career_applications(status, created_at desc);
create index if not exists career_applications_email_idx on public.career_applications(lower(email), created_at desc);
create trigger career_applications_updated before update on public.career_applications
  for each row execute function public.set_updated_at();

alter table public.career_applications enable row level security;
revoke all on public.career_applications from anon;
grant select, update (status, admin_notes) on public.career_applications to authenticated;
create policy career_applications_admin_select on public.career_applications
  for select to authenticated using (public.is_admin());
create policy career_applications_admin_update on public.career_applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('career-resumes', 'career-resumes', false, 5242880,
  array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;

create policy career_resumes_admin_read on storage.objects
  for select to authenticated using (bucket_id = 'career-resumes' and public.is_admin());
