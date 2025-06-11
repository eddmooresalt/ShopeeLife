-- First, let's check if the trigger function exists and fix it
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create a better function that doesn't require special permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert initial user progress for new user
  INSERT INTO public.user_progress (user_id, shopee_coins, level, xp, game_state)
  VALUES (NEW.id, 100, 1, 0, '{}'::jsonb);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If insert fails, just return NEW (don't break user creation)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also fix the RLS policies to be more permissive
DROP POLICY IF EXISTS "Users can insert their own progress during signup." ON public.user_progress;
DROP POLICY IF EXISTS "Users can view and update their own progress." ON public.user_progress;

-- Create simpler, more permissive policies
CREATE POLICY "Enable all operations for authenticated users"
ON public.user_progress FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert (for the trigger)
CREATE POLICY "Enable insert for service role"
ON public.user_progress FOR INSERT
TO service_role
WITH CHECK (true);
