-- Fix authentication settings to allow immediate login after signup

-- 1. Check current auth settings
SELECT 
  'Current auth settings:' as info,
  email_confirm,
  phone_confirm,
  sms_confirm
FROM auth.config;

-- 2. Disable email confirmation completely
UPDATE auth.config 
SET email_confirm = false
WHERE id = 1;

-- 3. Force confirm all existing users
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  phone_confirmed_at = COALESCE(phone_confirmed_at, now())
WHERE email_confirmed_at IS NULL OR phone_confirmed_at IS NULL;

-- 4. Check existing users and their confirmation status
SELECT 
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  phone_confirmed_at IS NOT NULL as phone_confirmed,
  created_at,
  last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Check if users have progress records
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmed,
  up.shopee_coins,
  up.level
FROM auth.users u
LEFT JOIN public.user_progress up ON u.id = up.user_id
ORDER BY u.created_at DESC
LIMIT 5;

-- 6. Show final auth config
SELECT 
  'Email confirmation disabled:' as status,
  NOT email_confirm as disabled
FROM auth.config;
