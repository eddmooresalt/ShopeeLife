-- Force confirm all users (in case email confirmation is cached/stuck)
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    phone_confirmed_at = COALESCE(phone_confirmed_at, now())
WHERE email_confirmed_at IS NULL OR phone_confirmed_at IS NULL;

-- Check current user status
SELECT id, email, email_confirmed_at, phone_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
