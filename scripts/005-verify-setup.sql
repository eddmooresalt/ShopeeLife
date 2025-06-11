-- Check if the user_progress table exists with correct columns
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'user_progress';

-- Check if users are confirmed
SELECT id, email, email_confirmed_at FROM auth.users;

-- Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';
