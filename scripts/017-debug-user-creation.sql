-- Debug exactly what's happening with user creation

-- 1. Show all users currently in the database
SELECT 
  'All users in database:' as info,
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at,
  updated_at,
  last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Check if your specific email exists
SELECT 
  'Your email status:' as info,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as email_confirmed,
  raw_app_meta_data,
  raw_user_meta_data
FROM auth.users 
WHERE email ILIKE '%edmiral%' OR email ILIKE '%gmail%';

-- 3. Check auth configuration
SELECT 
  'Auth config:' as info,
  email_confirm,
  phone_confirm,
  signup_enabled,
  password_min_length
FROM auth.config;

-- 4. Try to manually create a working user for testing
DO $$
DECLARE
  new_user_id uuid;
  test_email text := 'test-working@example.com';
  test_password text := 'testpass123';
BEGIN
  -- Delete test user if exists
  DELETE FROM auth.users WHERE email = test_email;
  
  -- Create a properly formatted user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    phone_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
  ) VALUES (
    gen_random_uuid(),
    test_email,
    crypt(test_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated',
    'authenticated'
  ) RETURNING id INTO new_user_id;
  
  RAISE NOTICE 'SUCCESS: Created test user % with ID %', test_email, new_user_id;
  
  -- Create progress for test user
  INSERT INTO public.user_progress (user_id, shopee_coins, level, xp)
  VALUES (new_user_id, 100, 1, 0);
  
  RAISE NOTICE 'SUCCESS: Created progress for test user';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'ERROR creating test user: %', SQLERRM;
END $$;

-- 5. Show the test user we just created
SELECT 
  'Test user created:' as info,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as confirmed
FROM auth.users 
WHERE email = 'test-working@example.com';

SELECT 'Run this script and then try logging in with test-working@example.com / testpass123' as instructions;
