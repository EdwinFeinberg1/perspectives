-- Create news table
create table if not exists public.news (
  id uuid default gen_random_uuid() not null primary key,
  title text not null,
  description text not null,
  url text not null,
  image_url text,
  published_at timestamp with time zone default now() not null,
  faiths text[] not null,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.news enable row level security;

-- Anyone can read news
create policy "Anyone can read news"
  on public.news
  for select
  to public
  using (true);

-- Only authenticated users can modify news
create policy "Only authenticated users can modify news"
  on public.news
  for all
  to authenticated
  using (true);

-- Add sample news articles
insert into public.news (title, description, url, image_url, faiths)
values 
  (
    'Global Leaders Meet for Climate Summit',
    'World leaders gathered to discuss urgent actions needed to address climate change.',
    'https://example.com/climate-summit',
    'https://example.com/images/climate-summit.jpg',
    ARRAY['rabbi', 'pastor', 'imam', 'buddha']
  ),
  (
    'New Scientific Breakthrough in Renewable Energy',
    'Scientists announce a major advancement in solar energy technology that could revolutionize renewable power.',
    'https://example.com/energy-breakthrough',
    'https://example.com/images/energy.jpg',
    ARRAY['rabbi', 'imam', 'buddha']
  ),
  (
    'Global Peace Initiative Launched',
    'A coalition of nations launches new program aimed at fostering international cooperation and ending regional conflicts.',
    'https://example.com/peace-initiative',
    'https://example.com/images/peace.jpg',
    ARRAY['rabbi', 'pastor', 'imam', 'buddha']
  )
ON CONFLICT DO NOTHING; 