-- First, let's completely reset the RLS policies and permissions
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.user_progress;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view and update their own progress." ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress during signup." ON public.user_progress;

-- Temporarily disable RLS to fix any existing issues
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create very permissive policies for authenticated users
CREATE POLICY "Allow authenticated users full access to their own progress"
ON public.user_progress
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow anon users to insert (for signup process)
CREATE POLICY "Allow anon users to insert progress during signup"
ON public.user_progress
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow service role full access (for triggers and admin operations)
CREATE POLICY "Allow service role full access"
ON public.user_progress
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Update the trigger function to be more robust
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Use a more permissive approach
  INSERT INTO public.user_progress (user_id, shopee_coins, level, xp, game_state)
  VALUES (NEW.id, 100, 1, 0, '{}'::jsonb);
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- User progress already exists, that's fine
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log the error but don't fail user creation
    RAISE WARNING 'Failed to create user progress for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO anon;
GRANT ALL ON public.user_progress TO service_role;

-- Verify the setup
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  hasrls
FROM pg_tables 
WHERE tablename = 'user_progress';

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_progress';
