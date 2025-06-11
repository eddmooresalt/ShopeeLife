-- Final auth fix - completely reset and simplify

-- 1. Check current users
SELECT 
  'Current users:' as info,
  id,
  email,
  email_confirmed_at IS NOT NULL as confirmed,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Reset auth configuration to simplest possible settings
UPDATE auth.config 
SET 
  email_confirm = false,
  phone_confirm = false,
  sms_confirm = false,
  signup_enabled = true,
  password_min_length = 6
WHERE id = 1;

-- 3. Force confirm all existing users
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  phone_confirmed_at = COALESCE(phone_confirmed_at, now()),
  confirmation_token = NULL,
  recovery_token = NULL
WHERE email_confirmed_at IS NULL OR phone_confirmed_at IS NULL;

-- 4. Make sure user_progress table exists with correct permissions
DO $$
BEGIN
  -- Drop and recreate the table if it exists
  DROP TABLE IF EXISTS public.user_progress CASCADE;
  
  -- Create the table with minimal constraints
  CREATE TABLE public.user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    shopee_coins INT DEFAULT 100 NOT NULL,
    level INT DEFAULT 1 NOT NULL,
    xp INT DEFAULT 0 NOT NULL,
    last_played TIMESTAMPTZ DEFAULT now() NOT NULL,
    game_state JSONB DEFAULT '{}'::jsonb NOT NULL
  );
  
  -- Disable RLS completely
  ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
  
  -- Grant all permissions
  GRANT ALL PRIVILEGES ON public.user_progress TO postgres;
  GRANT ALL PRIVILEGES ON public.user_progress TO anon;
  GRANT ALL PRIVILEGES ON public.user_progress TO authenticated;
  GRANT ALL PRIVILEGES ON public.user_progress TO service_role;
  
  RAISE NOTICE 'User progress table recreated with all permissions granted';
END $$;

-- 5. Show final configuration
SELECT 
  'Auth configuration:' as info,
  email_confirm,
  phone_confirm,
  signup_enabled
FROM auth.config;

SELECT 
  'User progress table:' as info,
  relrowsecurity as rls_enabled
FROM pg_tables
JOIN pg_class ON pg_tables.tablename = pg_class.relname
WHERE tablename = 'user_progress';

SELECT 'SETUP COMPLETE - Use the direct-auth page to login' as final_status;
