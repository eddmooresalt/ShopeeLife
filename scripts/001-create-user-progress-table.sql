-- Create the user_progress table
CREATE TABLE public.user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    shopee_coins INT DEFAULT 100 NOT NULL,
    level INT DEFAULT 1 NOT NULL,
    xp INT DEFAULT 0 NOT NULL,
    last_played TIMESTAMPTZ DEFAULT now() NOT NULL,
    game_state JSONB DEFAULT '{}'::jsonb NOT NULL -- To store other game-specific data
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policy for users to view and update their own progress
CREATE POLICY "Users can view and update their own progress."
ON public.user_progress FOR ALL
USING (auth.uid() = user_id);

-- Policy for users to insert their own progress (on first login/signup)
CREATE POLICY "Users can insert their own progress."
ON public.user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);
