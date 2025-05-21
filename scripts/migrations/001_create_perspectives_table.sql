-- Create perspectives table
create table if not exists
  public.perspectives (
    id uuid default gen_random_uuid() not null,
    news_id text not null,
    faith text not null,
    perspective text not null,
    created_at timestamp with time zone default now() not null,
    primary key (id),
    constraint unique_news_faith unique (news_id, faith)
  );

-- Set up row level security
alter table public.perspectives enable row level security;

-- Create a policy that allows anyone to read perspectives
create policy "Anyone can read perspectives"
  on public.perspectives
  for select
  to public
  using (true);

-- Create a policy that allows only authenticated users to insert/update/delete
create policy "Only authenticated users can modify perspectives"
  on public.perspectives
  for all
  to authenticated
  using (true);

-- Create an index for faster lookups
create index if not exists perspectives_news_faith_idx
  on public.perspectives (news_id, faith);

-- Add comment to table
comment on table public.perspectives is 'Stores pre-generated faith perspectives for news articles'; 