-- Create learning paths table
create table if not exists public.learning_paths (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
  estimated_duration integer, -- in hours
  language language_code default 'en',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create learning modules table
create table if not exists public.learning_modules (
  id uuid primary key default uuid_generate_v4(),
  path_id uuid references public.learning_paths(id) on delete cascade,
  title text not null,
  description text,
  content text not null,
  module_order integer not null,
  estimated_duration integer, -- in minutes
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create user progress table
create table if not exists public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  module_id uuid references public.learning_modules(id) on delete cascade,
  completed_at timestamptz,
  progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, module_id)
);

-- Create personalized recommendations table
create table if not exists public.ai_recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  recommended_content jsonb not null, -- stores AI-generated recommendations
  recommendation_type text not null, -- 'learning_path', 'module', 'content'
  confidence_score decimal(3,2) check (confidence_score >= 0 and confidence_score <= 1),
  is_viewed boolean default false,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '30 days')
);

-- Enable RLS
alter table public.learning_paths enable row level security;
alter table public.learning_modules enable row level security;
alter table public.user_progress enable row level security;
alter table public.ai_recommendations enable row level security;

-- Learning paths policies
create policy "learning_paths_public_read"
  on public.learning_paths for select
  using (is_active = true);

create policy "learning_paths_admin_all"
  on public.learning_paths for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Learning modules policies
create policy "learning_modules_public_read"
  on public.learning_modules for select
  using (
    not is_premium or 
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('member', 'premium', 'admin')
    )
  );

create policy "learning_modules_admin_all"
  on public.learning_modules for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- User progress policies
create policy "user_progress_own"
  on public.user_progress for all
  using (auth.uid() = user_id);

create policy "user_progress_admin_read"
  on public.user_progress for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- AI recommendations policies
create policy "ai_recommendations_own"
  on public.ai_recommendations for all
  using (auth.uid() = user_id);

-- Add updated_at triggers
create trigger learning_paths_updated_at
  before update on public.learning_paths
  for each row
  execute function public.handle_updated_at();

create trigger learning_modules_updated_at
  before update on public.learning_modules
  for each row
  execute function public.handle_updated_at();

create trigger user_progress_updated_at
  before update on public.user_progress
  for each row
  execute function public.handle_updated_at();
