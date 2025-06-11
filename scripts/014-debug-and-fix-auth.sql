-- Debug and fix authentication issues

-- 1. Check current auth configuration
SELECT 
  'Auth Config Check:' as info,
  email_confirm as email_confirmation_enabled,
  phone_confirm as phone_confirmation_enabled,
  sms_confirm as sms_confirmation_enabled
FROM auth.config;

-- 2. Completely disable all confirmations
UPDATE auth.config 
SET 
  email_confirm = false,
  phone_confirm = false,
  sms_confirm = false
WHERE id = 1;

-- 3. Check all existing users and their status
SELECT 
  'User Status:' as info,
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as email_confirmed,
  phone_confirmed_at IS NOT NULL as phone_confirmed,
  created_at,
  updated_at,
  last_sign_in_at,
  confirmation_sent_at,
  confirmation_token IS NOT NULL as has_confirmation_token
FROM auth.users 
ORDER BY created_at DESC;

-- 4. Force confirm ALL users (remove any confirmation requirements)
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  phone_confirmed_at = COALESCE(phone_confirmed_at, now()),
  confirmation_token = NULL,
  recovery_token = NULL,
  email_change_token_new = NULL,
  email_change_token_current = NULL
WHERE email_confirmed_at IS NULL 
   OR phone_confirmed_at IS NULL 
   OR confirmation_token IS NOT NULL;

-- 5. Check user progress table
SELECT 
  'User Progress Check:' as info,
  COUNT(*) as total_progress_records
FROM public.user_progress;

-- 6. Show users with their progress
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmed,
  up.shopee_coins,
  up.level,
  up.xp
FROM auth.users u
LEFT JOIN public.user_progress up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- 7. Clean up any duplicate or problematic records
DELETE FROM auth.users 
WHERE email_confirmed_at IS NULL 
  AND created_at < (now() - interval '1 hour');

-- 8. Final verification
SELECT 
  'Final Status:' as info,
  'Email confirmation: ' || CASE WHEN email_confirm THEN 'ENABLED' ELSE 'DISABLED' END as email_status,
  'Total users: ' || (SELECT COUNT(*) FROM auth.users) as user_count,
  'Confirmed users: ' || (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL) as confirmed_count
FROM auth.config;
