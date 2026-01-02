-- Create tables for poem management and user profiles
-- Enable RLS for all tables
-- poems table: stores generated poems
-- profiles table: stores user meta-data linked to Supabase Auth

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  photo_url TEXT,
  notification_preferences JSONB DEFAULT '{"dailyInspiration": true, "holidayEvents": true}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create poems table
CREATE TABLE IF NOT EXISTS public.poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  poem TEXT NOT NULL,
  image JSONB NOT NULL, -- Stores ImagePlaceholder data
  collection TEXT, -- e.g. "Favorites", "Drafts"
  controls JSONB, -- Stores CreativeControlsState
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on poems
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;

-- Poems Policies
CREATE POLICY "Users can view their own poems" ON public.poems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own poems" ON public.poems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own poems" ON public.poems
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own poems" ON public.poems
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to handle new user profiles automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, photo_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on sign up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
