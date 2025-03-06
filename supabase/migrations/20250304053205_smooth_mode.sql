-- Example migration I can provide
create table if not exists example_table (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  data jsonb
);

-- Example RLS policy
create policy "Example policy"
on example_table
for all
using (auth.uid() = user_id)
with check (true);
