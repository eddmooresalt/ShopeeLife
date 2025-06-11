-- Check if we can access the database and see the current setup
SELECT 'Database connection successful' as status;

-- Check if user_progress table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_progress') 
    THEN 'user_progress table EXISTS' 
    ELSE 'user_progress table MISSING' 
  END as table_status;

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM 
  information_schema.columns
WHERE 
  table_name = 'user_progress'
ORDER BY ordinal_position;

-- Check RLS status
SELECT 
  schemaname,
  tablename, 
  rowsecurity as rls_enabled,
  hasrls
FROM 
  pg_tables
WHERE 
  tablename = 'user_progress';

-- Check policies
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM 
  pg_policies
WHERE 
  tablename = 'user_progress';

-- Check existing users
SELECT 
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at
FROM 
  auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Check existing user progress
SELECT 
  up.user_id,
  u.email,
  up.shopee_coins,
  up.level,
  up.xp,
  up.last_played
FROM 
  public.user_progress up
  LEFT JOIN auth.users u ON up.user_id = u.id
ORDER BY up.last_played DESC
LIMIT 5;

-- Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM 
  information_schema.triggers
WHERE 
  event_object_table = 'users'
  AND event_object_schema = 'auth';
