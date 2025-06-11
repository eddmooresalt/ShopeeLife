-- Check if the user_progress table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_progress') THEN
    -- Create the user_progress table if it doesn't exist
    CREATE TABLE public.user_progress (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
      shopee_coins INT DEFAULT 100 NOT NULL,
      level INT DEFAULT 1 NOT NULL,
      xp INT DEFAULT 0 NOT NULL,
      last_played TIMESTAMPTZ DEFAULT now() NOT NULL,
      game_state JSONB DEFAULT '{}'::jsonb NOT NULL
    );
    
    RAISE NOTICE 'Created user_progress table';
  ELSE
    RAISE NOTICE 'user_progress table already exists';
  END IF;
END $$;

-- Disable RLS temporarily
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view and update their own progress." ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress." ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress during signup." ON public.user_progress;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.user_progress;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_progress;
DROP POLICY IF EXISTS "Allow authenticated users full access to their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow anon users to insert progress during signup" ON public.user_progress;
DROP POLICY IF EXISTS "Allow service role full access" ON public.user_progress;

-- Re-enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
ON public.user_progress
FOR ALL
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

-- Grant all permissions
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO anon;
GRANT ALL ON public.user_progress TO service_role;

-- Check for existing users without progress
INSERT INTO public.user_progress (user_id, shopee_coins, level, xp, game_state)
SELECT id, 100, 1, 0, '{}'::jsonb
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_progress WHERE user_id = auth.users.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Show table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'user_progress';

-- Show RLS status
SELECT 
  tablename, 
  rowsecurity
FROM 
  pg_tables
WHERE 
  tablename = 'user_progress';

-- Show policies
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual
FROM 
  pg_policies
WHERE 
  tablename = 'user_progress';
