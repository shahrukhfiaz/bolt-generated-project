-- Enable RLS for popular_websites table
alter table popular_websites enable row level security;

-- Create policies for popular_websites
create policy "Admins can manage popular websites" 
on popular_websites
for all
to authenticated
using (true)
with check (true);

create policy "Public can read popular websites"
on popular_websites
for select
to anon
using (true);
