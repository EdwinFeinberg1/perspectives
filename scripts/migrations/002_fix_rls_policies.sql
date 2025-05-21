-- Drop the existing policy
drop policy if exists "Only authenticated users can modify perspectives" on public.perspectives;

-- Also drop the read policy if it exists (we'll recreate it)
drop policy if exists "Anyone can read perspectives" on public.perspectives;

-- Create a more permissive policy that allows inserts with the anon key (for our script)
create policy "Allow script to insert perspectives"
  on public.perspectives
  for insert
  to anon
  with check (true);
  
-- Create separate policies for update and delete
create policy "Authenticated users can update perspectives"
  on public.perspectives
  for update
  to authenticated
  using (true);

create policy "Authenticated users can delete perspectives"
  on public.perspectives
  for delete
  to authenticated
  using (true);

-- Create the read policy
create policy "Anyone can read perspectives"
  on public.perspectives
  for select
  to public
  using (true); 