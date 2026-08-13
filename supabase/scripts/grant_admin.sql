-- Grant admin access to a Supabase Auth user.
-- Run in Supabase → SQL Editor.
--
-- Step 1: Run phase8_01_helpers_and_admins.sql first if you have not already.
-- Step 2: Replace the email below, then run this script.

INSERT INTO public.admins (user_id, email, role)
SELECT u.id, u.email, 'owner'
FROM auth.users u
WHERE u.email = 'krishna@aa100xtech.com'
ON CONFLICT (user_id) DO UPDATE
  SET role = 'owner', email = EXCLUDED.email;

-- Should return one row with role = owner
SELECT a.email, a.role, a.user_id
FROM public.admins a
WHERE a.email = 'krishna@aa100xtech.com';
