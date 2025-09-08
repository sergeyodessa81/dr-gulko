-- Create subscription plans table
create table if not exists public.subscription_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_monthly decimal(10,2),
  price_yearly decimal(10,2),
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  features jsonb default '[]',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create user subscriptions table
create table if not exists public.user_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan_id uuid references public.subscription_plans(id) on delete cascade,
  stripe_subscription_id text unique,
  status subscription_status default 'incomplete',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create payment history table
create table if not exists public.payment_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  subscription_id uuid references public.user_subscriptions(id) on delete set null,
  stripe_payment_intent_id text unique,
  amount decimal(10,2) not null,
  currency text default 'usd',
  status text not null,
  description text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.payment_history enable row level security;

-- Subscription plans policies (public read)
create policy "subscription_plans_public_read"
  on public.subscription_plans for select
  using (is_active = true);

create policy "subscription_plans_admin_all"
  on public.subscription_plans for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- User subscriptions policies
create policy "user_subscriptions_own"
  on public.user_subscriptions for all
  using (auth.uid() = user_id);

create policy "user_subscriptions_admin_all"
  on public.user_subscriptions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Payment history policies
create policy "payment_history_own"
  on public.payment_history for select
  using (auth.uid() = user_id);

create policy "payment_history_admin_all"
  on public.payment_history for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Add updated_at triggers
create trigger subscription_plans_updated_at
  before update on public.subscription_plans
  for each row
  execute function public.handle_updated_at();

create trigger user_subscriptions_updated_at
  before update on public.user_subscriptions
  for each row
  execute function public.handle_updated_at();
