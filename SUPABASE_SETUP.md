-- Create user_profiles table
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  prayer_favorites text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.user_profiles enable row level security;

-- Create policy to allow users to read their own profile
create policy "Users can read own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

-- Create policy to allow users to update their own profile
create policy "Users can update own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id);

-- Create policy to allow users to insert their own profile
create policy "Users can insert own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
  before update on public.user_profiles
  for each row
  execute procedure public.handle_updated_at();

-- Create trigger to create profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();