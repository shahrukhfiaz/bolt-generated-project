/*
  # Create popular_websites table

  1. Table Structure
    - id (primary key)
    - url (unique)
    - name
    - description
    - category
    - created_at
    - updated_at
    - is_active
*/

CREATE TABLE IF NOT EXISTS popular_websites (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE popular_websites ENABLE ROW LEVEL SECURITY;

-- Create policies for popular_websites
CREATE POLICY "Admins can manage popular websites" 
ON popular_websites
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can read popular websites"
ON popular_websites
FOR SELECT
TO anon
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_popular_websites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_popular_websites_updated_at
BEFORE UPDATE ON popular_websites
FOR EACH ROW
EXECUTE FUNCTION update_popular_websites_updated_at();
