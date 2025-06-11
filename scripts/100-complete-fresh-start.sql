-- COMPLETE FRESH START - Delete everything and start over

-- 1. Delete ALL users and progress
DELETE FROM public.user_progress;
DELETE FROM auth.users;

-- 2. Drop and recreate user_progress table
DROP TABLE IF EXISTS public.user_progress CASCADE;

CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  shopee_coins INT DEFAULT 100 NOT NULL,
  level INT DEFAULT 1 NOT NULL,
  xp INT DEFAULT 0 NOT NULL,
  last_played TIMESTAMPTZ DEFAULT now() NOT NULL,
  game_state JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 3. Disable ALL security
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- 4. Grant ALL permissions to EVERYONE
GRANT ALL ON public.user_progress TO postgres, anon, authenticated, service_role;

-- 5. Set auth to SIMPLEST possible configuration
UPDATE auth.config 
SET 
  email_confirm = false,
  phone_confirm = false,
  sms_confirm = false,
  signup_enabled = true,
  password_min_length = 6;

-- 6. Create trigger for auto user progress
CREATE OR REPLACE FUNCTION public.create_user_progress()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_progress();

SELECT 'COMPLETE RESET DONE - Everything is clean and simple now' as status;
