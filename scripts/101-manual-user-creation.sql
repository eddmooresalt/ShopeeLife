-- Create a user manually that will definitely work

-- 1. Clean everything first
DELETE FROM public.user_progress;
DELETE FROM auth.users;

-- 2. Create a user manually with proper password hashing
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
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'test@game.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated',
  'authenticated'
);

-- 3. Create progress for this user
INSERT INTO public.user_progress (
  user_id,
  shopee_coins,
  level,
  xp
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  100,
  1,
  0
);

-- 4. Show what we created
SELECT 
  'Created user:' as info,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as confirmed
FROM auth.users 
WHERE email = 'test@game.com';

SELECT 
  'Created progress:' as info,
  shopee_coins,
  level,
  xp
FROM public.user_progress 
WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

SELECT 'MANUAL USER CREATED - Use test@game.com / password123 to login' as final_status;
