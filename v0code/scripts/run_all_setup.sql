-- Combined all setup scripts for easy execution
-- Run all database setup scripts in sequence

-- Users and profiles setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'member', 'premium', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'member', 'premium')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  stripe_customer_id TEXT UNIQUE,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'de', 'ru', 'uk')),
  learning_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content management tables
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES public.user_profiles(id),
  category_id UUID REFERENCES public.categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  access_level TEXT DEFAULT 'free' CHECK (access_level IN ('free', 'member', 'premium')),
  reading_time INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Language Lab tables
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER, -- in minutes
  language TEXT DEFAULT 'en',
  access_level TEXT DEFAULT 'free' CHECK (access_level IN ('free', 'member', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id),
  learning_path_id UUID REFERENCES public.learning_paths(id),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_modules JSONB DEFAULT '[]',
  notes TEXT,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, learning_path_id)
);

-- Insert sample data
INSERT INTO public.categories (name, slug, description, color) VALUES
  ('Trauma Surgery', 'trauma-surgery', 'Emergency and trauma surgical procedures', '#ef4444'),
  ('Orthopedics', 'orthopedics', 'Bone and joint surgical procedures', '#3b82f6'),
  ('Medical Education', 'medical-education', 'Teaching and learning resources', '#10b981'),
  ('Research', 'research', 'Latest medical research and findings', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tags (name, slug) VALUES
  ('Surgery', 'surgery'),
  ('Education', 'education'),
  ('Techniques', 'techniques'),
  ('Case Studies', 'case-studies'),
  ('Innovation', 'innovation')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.learning_paths (title, description, difficulty_level, estimated_duration, access_level) VALUES
  ('Introduction to Trauma Surgery', 'Basic principles and techniques in trauma surgery', 'beginner', 120, 'free'),
  ('Advanced Orthopedic Procedures', 'Complex surgical techniques for orthopedic conditions', 'advanced', 240, 'premium'),
  ('Medical German for Surgeons', 'Essential German medical terminology', 'intermediate', 180, 'member')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Published posts are viewable by everyone" ON public.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);
