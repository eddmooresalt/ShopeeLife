-- 0. Show what users currently exist BEFORE cleanup
SELECT 
  'BEFORE CLEANUP - Current users:' as info,
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at
FROM auth.users 
ORDER BY created_at DESC;

-- Show if edmiral@gmail.com specifically exists
SELECT 
  'edmiral@gmail.com status:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'edmiral@gmail.com') 
    THEN 'EXISTS' 
    ELSE 'DOES NOT EXIST' 
  END as user_exists;

-- Complete auth reset and fix

-- 1. Check what's actually in the auth.users table
SELECT 
  'Current users in database:' as info,
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at,
  created_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Delete all existing users to start fresh
DELETE FROM public.user_progress;
DELETE FROM auth.users;

-- 3. Reset auth configuration completely
UPDATE auth.config 
SET 
  email_confirm = false,
  phone_confirm = false,
  sms_confirm = false,
  signup_enabled = true,
  password_min_length = 6
WHERE id = 1;

-- 4. Check auth config
SELECT 
  'Auth configuration:' as info,
  email_confirm,
  phone_confirm,
  signup_enabled,
  password_min_length
FROM auth.config;

-- 5. Verify tables are clean
SELECT 
  'Users after cleanup:' as info,
  COUNT(*) as user_count
FROM auth.users;

SELECT 
  'User progress after cleanup:' as info,
  COUNT(*) as progress_count
FROM public.user_progress;

-- 6. Test that we can insert a user manually (this should work)
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Try to create a test user manually
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    'test@example.com',
    crypt('testpassword', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated'
  ) RETURNING id INTO test_user_id;
  
  RAISE NOTICE 'SUCCESS: Test user created with ID %', test_user_id;
  
  -- Clean up test user
  DELETE FROM auth.users WHERE id = test_user_id;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'ERROR: Could not create test user: %', SQLERRM;
END $$;

SELECT 'Database is ready for fresh signup attempts' as final_status;
