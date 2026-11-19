-- Override project default grants; only server submissions and admin review are allowed.
revoke all on public.career_applications from public, anon, authenticated, service_role;
grant select, update (status, admin_notes) on public.career_applications to authenticated;
grant select, insert, delete on public.career_applications to service_role;
