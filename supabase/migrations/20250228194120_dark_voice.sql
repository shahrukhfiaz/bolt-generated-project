/*
  # Fix website ID type

  1. Changes
    - Update the websites table to use UUID for ID instead of text
    - Update the incidents and outage_reports tables to use UUID for website_id
    - Add name field to websites table to store domain name
*/

-- First, check if the websites table has the correct ID type
DO $$
BEGIN
  -- Check if the ID column is already UUID
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' 
    AND column_name = 'id' 
    AND data_type = 'uuid'
  ) THEN
    -- ID is already UUID, no need to modify
    RAISE NOTICE 'websites table ID is already UUID type';
  ELSE
    -- ID is not UUID, need to update
    RAISE NOTICE 'Updating websites table ID to UUID type';
    
    -- Create a temporary table with the correct structure
    CREATE TABLE websites_new (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      url TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'unknown',
      last_checked TIMESTAMPTZ DEFAULT now(),
      response_time INTEGER,
      name TEXT
    );
    
    -- Copy data from old table to new table
    INSERT INTO websites_new (url, status, last_checked, response_time, name)
    SELECT url, status, last_checked, response_time, name FROM websites;
    
    -- Drop the old table
    DROP TABLE websites;
    
    -- Rename the new table to the original name
    ALTER TABLE websites_new RENAME TO websites;
    
    -- Re-enable RLS
    ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
    
    -- Recreate policies
    CREATE POLICY "Allow anonymous read access to websites"
      ON websites
      FOR SELECT
      TO anon
      USING (true);

    CREATE POLICY "Allow authenticated read access to websites"
      ON websites
      FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated insert to websites"
      ON websites
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Update incidents table to use text for website_id instead of UUID
DO $$
BEGIN
  -- Check if the website_id column is already TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'incidents' 
    AND column_name = 'website_id' 
    AND data_type = 'text'
  ) THEN
    -- website_id is already TEXT, no need to modify
    RAISE NOTICE 'incidents table website_id is already TEXT type';
  ELSE
    -- website_id is not TEXT, need to update
    RAISE NOTICE 'Updating incidents table website_id to TEXT type';
    
    -- Alter the column type
    ALTER TABLE incidents ALTER COLUMN website_id TYPE TEXT;
  END IF;
END $$;

-- Update outage_reports table to use text for website_id instead of UUID
DO $$
BEGIN
  -- Check if the website_id column is already TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'outage_reports' 
    AND column_name = 'website_id' 
    AND data_type = 'text'
  ) THEN
    -- website_id is already TEXT, no need to modify
    RAISE NOTICE 'outage_reports table website_id is already TEXT type';
  ELSE
    -- website_id is not TEXT, need to update
    RAISE NOTICE 'Updating outage_reports table website_id to TEXT type';
    
    -- Alter the column type
    ALTER TABLE outage_reports ALTER COLUMN website_id TYPE TEXT;
  END IF;
END $$;

-- Add name column to websites table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE websites ADD COLUMN name TEXT;
  END IF;
END $$;

-- Insert initial popular websites if table is empty
INSERT INTO websites (url, status, last_checked, response_time, name)
SELECT * FROM (
  VALUES
    ('https://google.com', 'up', now(), 125, 'Google'),
    ('https://facebook.com', 'down', now(), null, 'Facebook'),
    ('https://youtube.com', 'up', now(), 180, 'YouTube'),
    ('https://x.com', 'down', now(), null, 'X'),
    ('https://twitter.com', 'down', now(), null, 'Twitter'),
    ('https://instagram.com', 'up', now(), 245, 'Instagram'),
    ('https://amazon.com', 'up', now(), 290, 'Amazon'),
    ('https://netflix.com', 'up', now(), 310, 'Netflix'),
    ('https://reddit.com', 'down', now(), null, 'Reddit'),
    ('https://github.com', 'up', now(), 195, 'GitHub'),
    ('https://microsoft.com', 'up', now(), 185, 'Microsoft'),
    ('https://apple.com', 'up', now(), 165, 'Apple'),
    ('https://zoom.us', 'up', now(), 205, 'Zoom'),
    ('https://discord.com', 'down', now(), null, 'Discord'),
    ('https://spotify.com', 'up', now(), 220, 'Spotify'),
    ('https://cloudflare.com', 'up', now(), 175, 'Cloudflare')
) AS new_values (url, status, last_checked, response_time, name)
WHERE NOT EXISTS (
  SELECT 1 FROM websites WHERE websites.url = new_values.url
);
