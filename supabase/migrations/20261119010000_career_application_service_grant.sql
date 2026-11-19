-- This project revokes default public-schema grants, including service_role.
-- The public submission endpoint uses its server-only secret key for these operations.
grant select, insert, delete on public.career_applications to service_role;
