-- Complete setup for new Supabase project
-- Run this in your NEW Supabase project's SQL Editor

-- 1. Create the user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  shopee_coins INT DEFAULT 100 NOT NULL,
  level INT DEFAULT 1 NOT NULL,
  xp INT DEFAULT 0 NOT NULL,
  last_played TIMESTAMPTZ DEFAULT now() NOT NULL,
  game_state JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 3. Create a simple, permissive policy
CREATE POLICY "Allow all operations for all users"
ON public.user_progress
FOR ALL
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

-- 4. Grant permissions
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO anon;
GRANT ALL ON public.user_progress TO service_role;

-- 5. Create trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_progress (user_id, shopee_coins, level, xp, game_state)
  VALUES (NEW.id, 100, 1, 0, '{}'::jsonb);
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Disable email confirmation (for easier testing)
UPDATE auth.config 
SET email_confirm = false 
WHERE id = 1;

-- 8. Verify setup
SELECT 'Setup complete!' as status;

-- Show table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'user_progress'
ORDER BY ordinal_position;

-- Show policies
SELECT 
  policyname, 
  cmd, 
  roles
FROM 
  pg_policies
WHERE 
  tablename = 'user_progress';
