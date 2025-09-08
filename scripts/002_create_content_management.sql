-- Create categories table
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  color text default '#3b82f6',
  language language_code default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create tags table
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  language language_code default 'en',
  created_at timestamptz default now()
);

-- Create posts table
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  featured_image text,
  status content_status default 'draft',
  language language_code default 'en',
  author_id uuid references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  published_at timestamptz,
  reading_time integer, -- in minutes
  view_count integer default 0,
  like_count integer default 0,
  is_premium boolean default false,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create post_tags junction table
create table if not exists public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Enable RLS on content tables
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;

-- Categories policies (public read, admin write)
create policy "categories_public_read"
  on public.categories for select
  using (true);

create policy "categories_admin_write"
  on public.categories for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Tags policies (public read, admin write)
create policy "tags_public_read"
  on public.tags for select
  using (true);

create policy "tags_admin_write"
  on public.tags for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Posts policies
create policy "posts_public_read_published"
  on public.posts for select
  using (
    status = 'published' and 
    (not is_premium or 
     exists (
       select 1 from public.profiles
       where id = auth.uid() and role in ('member', 'premium', 'admin')
     )
    )
  );

create policy "posts_author_all"
  on public.posts for all
  using (auth.uid() = author_id);

create policy "posts_admin_all"
  on public.posts for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Post tags policies
create policy "post_tags_public_read"
  on public.post_tags for select
  using (true);

create policy "post_tags_admin_write"
  on public.post_tags for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Add updated_at triggers
create trigger categories_updated_at
  before update on public.categories
  for each row
  execute function public.handle_updated_at();

create trigger posts_updated_at
  before update on public.posts
  for each row
  execute function public.handle_updated_at();
