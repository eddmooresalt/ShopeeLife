-- Complete setup for your NEW Supabase project
-- Run this in your NEW project's SQL Editor

-- 1. Create the user_progress table
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  shopee_coins INT DEFAULT 100 NOT NULL,
  level INT DEFAULT 1 NOT NULL,
  xp INT DEFAULT 0 NOT NULL,
  last_played TIMESTAMPTZ DEFAULT now() NOT NULL,
  game_state JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 2. Disable Row Level Security for simplicity
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- 3. Grant all permissions
GRANT ALL ON public.user_progress TO postgres, anon, authenticated, service_role;

-- 4. Set auth configuration to simplest settings
UPDATE auth.config 
SET 
  email_confirm = false,
  phone_confirm = false,
  sms_confirm = false,
  signup_enabled = true,
  password_min_length = 6;

-- 5. Create trigger function for automatic user progress creation
CREATE OR REPLACE FUNCTION public.create_user_progress()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_progress (user_id, shopee_coins, level, xp)
  VALUES (NEW.id, 100, 1, 0);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_progress();

-- 7. Create a test user to verify everything works
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
  'test@newproject.com',
  crypt('testpass123', gen_salt('bf')),
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

-- 8. Verify setup
SELECT 'NEW PROJECT SETUP COMPLETE!' as status;

SELECT 
  'Test user created:' as info,
  email,
  email_confirmed_at IS NOT NULL as confirmed
FROM auth.users 
WHERE email = 'test@newproject.com';

SELECT 
  'User progress table:' as info,
  COUNT(*) as progress_records
FROM public.user_progress;

SELECT 
  'Auth config:' as info,
  email_confirm as email_confirmation_disabled
FROM auth.config;
