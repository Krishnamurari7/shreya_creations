-- Private recruitment records. Apply to the existing Shreya Creation project.
create sequence if not exists public.employer_request_number_seq;

create table if not exists public.employer_staff_requests (
  id uuid primary key default gen_random_uuid(),
  request_id text not null unique default ('SC-HR-' || lpad(nextval('public.employer_request_number_seq')::text, 8, '0')),
  idempotency_key uuid not null unique,
  source_fingerprint text,
  company_name text not null,
  business_type text not null,
  business_type_other text,
  contact_name text not null,
  owner_name text,
  mobile text not null,
  whatsapp text,
  email text,
  website text,
  business_address text not null,
  business_state text not null,
  business_city text not null,
  pin_code text not null check (pin_code ~ '^\d{6}$'),
  work_address text not null,
  work_state text not null,
  work_city text not null,
  workplace_type text not null,
  workplace_type_other text,
  employment_type text not null,
  joining_date date,
  working_hours text,
  weekly_off text,
  accommodation boolean not null default false,
  food boolean not null default false,
  benefits text,
  details text,
  total_staff integer not null check (total_staff between 1 and 10000),
  status text not null default 'New' check (status in ('New','Under Review','Employer Contacted','Shortlisting','Interview','Selected','Joined','On Hold','Cancelled','Closed')),
  assigned_hr_user uuid references public.admins(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists employer_requests_created_idx on public.employer_staff_requests(created_at desc);
create index if not exists employer_requests_phone_idx on public.employer_staff_requests(mobile, created_at desc);
create index if not exists employer_requests_status_idx on public.employer_staff_requests(status, created_at desc);
create index if not exists employer_requests_city_idx on public.employer_staff_requests(work_city);
create trigger employer_requests_updated before update on public.employer_staff_requests
  for each row execute function public.set_updated_at();

create table if not exists public.employer_request_positions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.employer_staff_requests(id) on delete cascade,
  role text not null,
  custom_role text,
  quantity integer not null check (quantity between 1 and 1000),
  experience text not null,
  skills text,
  salary_min integer check (salary_min between 0 and 10000000),
  salary_max integer check (salary_max between 0 and 10000000),
  negotiable boolean not null default false,
  created_at timestamptz not null default now(),
  constraint position_salary_order check (salary_min is null or salary_max is null or salary_min <= salary_max)
);
create index if not exists employer_positions_request_idx on public.employer_request_positions(request_id);
create index if not exists employer_positions_role_idx on public.employer_request_positions(role);

create table if not exists public.employer_request_consents (
  request_id uuid primary key references public.employer_staff_requests(id) on delete cascade,
  accuracy_confirmed boolean not null check (accuracy_confirmed),
  terms_accepted boolean not null check (terms_accepted),
  contact_consent boolean not null check (contact_consent),
  terms_version text not null,
  accepted_at timestamptz not null default now()
);

-- Minimal private candidate reference; no public candidate listing or seeded people.
create table if not exists public.recruitment_candidates (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  display_name text not null,
  contact_phone text,
  city text,
  role_skills text,
  experience_note text,
  consent_to_process_at timestamptz not null,
  consent_to_share_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger recruitment_candidates_updated before update on public.recruitment_candidates
  for each row execute function public.set_updated_at();

create table if not exists public.request_candidate_matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.employer_staff_requests(id) on delete cascade,
  candidate_id uuid not null references public.recruitment_candidates(id) on delete restrict,
  stage text not null default 'Matched' check (stage in ('Matched','Contacted','Interview','Selected','Offer','Joined','Rejected')),
  rationale text,
  disclosed_at timestamptz,
  disclosed_by uuid references public.admins(user_id),
  offer_details text,
  joining_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, candidate_id),
  constraint disclosure_actor check ((disclosed_at is null and disclosed_by is null) or (disclosed_at is not null and disclosed_by is not null))
);
create trigger request_matches_updated before update on public.request_candidate_matches
  for each row execute function public.set_updated_at();

create table if not exists public.request_interviews (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.request_candidate_matches(id) on delete cascade,
  scheduled_at timestamptz not null,
  location_or_link text,
  assessment text,
  feedback text,
  outcome text check (outcome in ('Scheduled','Completed','Passed','Not Selected','Cancelled')),
  created_by uuid not null references public.admins(user_id),
  created_at timestamptz not null default now()
);

create table if not exists public.request_internal_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.employer_staff_requests(id) on delete cascade,
  author_user uuid not null references public.admins(user_id),
  note text not null check (char_length(note) between 1 and 5000),
  follow_up_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.request_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.employer_staff_requests(id) on delete cascade,
  previous_status text,
  current_status text not null,
  actor_user uuid references public.admins(user_id),
  created_at timestamptz not null default now()
);

create or replace function public.log_employer_request_status()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    insert into public.request_status_history(request_id, previous_status, current_status, actor_user)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;
revoke all on function public.log_employer_request_status() from public, anon, authenticated;
create trigger employer_request_status_audit after update of status on public.employer_staff_requests
  for each row execute function public.log_employer_request_status();

-- Single transaction: request, all positions, consent evidence, and initial status.
-- This function is callable only with the server-side service role key.
create or replace function public.submit_employer_staff_request(p_payload jsonb)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_request_id text;
  v_position jsonb;
  v_total integer := 0;
  v_key uuid;
  v_mobile text;
begin
  v_key := (p_payload->>'idempotencyKey')::uuid;
  v_mobile := p_payload->>'mobile';
  if v_key is null or v_mobile is null or p_payload->>'termsVersion' <> '2026-11-17'
     or p_payload->>'consentAccuracy' <> 'true' or p_payload->>'consentTerms' <> 'true'
     or p_payload->>'consentContact' <> 'true' then
    raise exception 'Invalid submission';
  end if;
  select request_id into v_request_id from public.employer_staff_requests where idempotency_key = v_key;
  if found then return v_request_id; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_mobile));
  if (select count(*) from public.employer_staff_requests where mobile = v_mobile and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Too many requests. Please try again later.';
  end if;
  if pg_catalog.jsonb_array_length(p_payload->'positions') not between 1 and 20 then raise exception 'Invalid positions'; end if;
  for v_position in select value from pg_catalog.jsonb_array_elements(p_payload->'positions') loop
    v_total := v_total + (v_position->>'quantity')::integer;
  end loop;
  if v_total not between 1 and 10000 then raise exception 'Invalid staff quantity'; end if;
  insert into public.employer_staff_requests (
    idempotency_key, source_fingerprint, company_name, business_type, business_type_other,
    contact_name, owner_name, mobile, whatsapp, email, website, business_address, business_state,
    business_city, pin_code, work_address, work_state, work_city, workplace_type, workplace_type_other,
    employment_type, joining_date, working_hours, weekly_off, accommodation, food, benefits, details, total_staff
  ) values (
    v_key, p_payload->>'sourceFingerprint', p_payload->>'companyName', p_payload->>'businessType', nullif(p_payload->>'businessTypeOther',''),
    p_payload->>'contactName', nullif(p_payload->>'ownerName',''), v_mobile, nullif(p_payload->>'whatsapp',''),
    nullif(p_payload->>'email',''), nullif(p_payload->>'website',''), p_payload->>'businessAddress', p_payload->>'businessState',
    p_payload->>'businessCity', p_payload->>'pinCode', p_payload->>'workAddress', p_payload->>'workState', p_payload->>'workCity',
    p_payload->>'workplaceType', nullif(p_payload->>'workplaceTypeOther',''), p_payload->>'employmentType',
    nullif(p_payload->>'joiningDate','')::date, nullif(p_payload->>'workingHours',''), nullif(p_payload->>'weeklyOff',''),
    (p_payload->>'accommodation')::boolean, (p_payload->>'food')::boolean, nullif(p_payload->>'benefits',''),
    nullif(p_payload->>'details',''), v_total
  ) returning id, request_id into v_id, v_request_id;
  for v_position in select value from pg_catalog.jsonb_array_elements(p_payload->'positions') loop
    insert into public.employer_request_positions(request_id, role, custom_role, quantity, experience, skills, salary_min, salary_max, negotiable)
    values (v_id, v_position->>'role', nullif(v_position->>'customRole',''), (v_position->>'quantity')::integer,
      v_position->>'experience', nullif(v_position->>'skills',''), nullif(v_position->>'salaryMin','')::integer,
      nullif(v_position->>'salaryMax','')::integer, (v_position->>'negotiable')::boolean);
  end loop;
  insert into public.employer_request_consents(request_id, accuracy_confirmed, terms_accepted, contact_consent, terms_version)
    values (v_id, true, true, true, p_payload->>'termsVersion');
  insert into public.request_status_history(request_id, current_status) values (v_id, 'New');
  return v_request_id;
end;
$$;
revoke all on function public.submit_employer_staff_request(jsonb) from public, anon, authenticated;
grant execute on function public.submit_employer_staff_request(jsonb) to service_role;

-- RLS on every private table; only existing admin accounts can read or mutate.
alter table public.employer_staff_requests enable row level security;
alter table public.employer_request_positions enable row level security;
alter table public.employer_request_consents enable row level security;
alter table public.recruitment_candidates enable row level security;
alter table public.request_candidate_matches enable row level security;
alter table public.request_interviews enable row level security;
alter table public.request_internal_notes enable row level security;
alter table public.request_status_history enable row level security;

grant select, update on public.employer_staff_requests to authenticated;
grant select on public.employer_request_positions, public.employer_request_consents, public.request_status_history to authenticated;
grant select, insert, update on public.recruitment_candidates, public.request_candidate_matches to authenticated;
grant select, insert, update on public.request_interviews to authenticated;
grant select, insert on public.request_internal_notes to authenticated;
grant usage on sequence public.employer_request_number_seq to service_role;
grant select on public.admins to authenticated;
revoke all on public.employer_staff_requests, public.employer_request_positions, public.employer_request_consents,
  public.recruitment_candidates, public.request_candidate_matches, public.request_interviews,
  public.request_internal_notes, public.request_status_history from anon;

create policy employer_requests_admin_select on public.employer_staff_requests for select to authenticated using (public.is_admin());
do $$ begin
  if not exists (select 1 from pg_catalog.pg_policies where schemaname = 'public' and tablename = 'admins' and policyname = 'admins_read_for_admin') then
    create policy admins_read_for_admin on public.admins for select to authenticated using (public.is_admin());
  end if;
end $$;
create policy employer_requests_admin_update on public.employer_staff_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy employer_positions_admin_select on public.employer_request_positions for select to authenticated using (public.is_admin());
create policy employer_consents_admin_select on public.employer_request_consents for select to authenticated using (public.is_admin());
create policy recruitment_candidates_admin_all on public.recruitment_candidates for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy request_matches_admin_select on public.request_candidate_matches for select to authenticated using (public.is_admin());
create policy request_matches_admin_insert on public.request_candidate_matches for insert to authenticated with check (public.is_admin() and (disclosed_at is null or exists (select 1 from public.recruitment_candidates c where c.id = candidate_id and c.consent_to_share_at is not null)));
create policy request_matches_admin_update on public.request_candidate_matches for update to authenticated using (public.is_admin()) with check (public.is_admin() and (disclosed_at is null or exists (select 1 from public.recruitment_candidates c where c.id = candidate_id and c.consent_to_share_at is not null)));
create policy request_interviews_admin_all on public.request_interviews for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy request_notes_admin_select on public.request_internal_notes for select to authenticated using (public.is_admin());
create policy request_notes_admin_insert on public.request_internal_notes for insert to authenticated with check (public.is_admin() and author_user = auth.uid());
create policy request_history_admin_select on public.request_status_history for select to authenticated using (public.is_admin());
