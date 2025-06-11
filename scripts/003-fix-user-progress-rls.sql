-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert their own progress." ON public.user_progress;

-- Create a more permissive INSERT policy that works during signup
CREATE POLICY "Users can insert their own progress during signup."
ON public.user_progress FOR INSERT
WITH CHECK (
  -- Allow insert if the user_id matches the authenticated user OR if it's during signup
  auth.uid() = user_id OR 
  -- Allow insert if the user exists in auth.users (for signup flow)
  EXISTS (SELECT 1 FROM auth.users WHERE id = user_id)
);

-- Alternative: Create a function to handle initial user progress creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_progress (user_id, shopee_coins, level, xp)
  VALUES (NEW.id, 100, 1, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create user progress when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
