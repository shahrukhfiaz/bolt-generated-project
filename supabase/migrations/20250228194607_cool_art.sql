/*
  # Fix Row-Level Security Policies

  1. Changes
    - Update RLS policies for websites table to allow anonymous inserts
    - Add public policies for all tables to ensure both authenticated and anonymous users can access them
*/

-- Drop existing policies for websites table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'websites' AND policyname = 'Allow anonymous read access to websites'
  ) THEN
    DROP POLICY "Allow anonymous read access to websites" ON websites;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'websites' AND policyname = 'Allow authenticated read access to websites'
  ) THEN
    DROP POLICY "Allow authenticated read access to websites" ON websites;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'websites' AND policyname = 'Allow authenticated insert to websites'
  ) THEN
    DROP POLICY "Allow authenticated insert to websites" ON websites;
  END IF;
END $$;

-- Create new policies for websites table that allow public access
CREATE POLICY "Allow public read access to websites"
  ON websites
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to websites"
  ON websites
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to websites"
  ON websites
  FOR UPDATE
  USING (true);

-- Ensure incidents table has proper policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'incidents' AND policyname = 'Allow public read access to incidents'
  ) THEN
    DROP POLICY "Allow public read access to incidents" ON incidents;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'incidents' AND policyname = 'Allow public insert to incidents'
  ) THEN
    DROP POLICY "Allow public insert to incidents" ON incidents;
  END IF;
END $$;

-- Create policies for incidents table
CREATE POLICY "Allow public read access to incidents"
  ON incidents
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to incidents"
  ON incidents
  FOR INSERT
  WITH CHECK (true);

-- Ensure outage_reports table has proper policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'outage_reports' AND policyname = 'Allow public read access to outage_reports'
  ) THEN
    DROP POLICY "Allow public read access to outage_reports" ON outage_reports;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'outage_reports' AND policyname = 'Allow public insert to outage_reports'
  ) THEN
    DROP POLICY "Allow public insert to outage_reports" ON outage_reports;
  END IF;
END $$;

-- Create policies for outage_reports table
CREATE POLICY "Allow public read access to outage_reports"
  ON outage_reports
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to outage_reports"
  ON outage_reports
  FOR INSERT
  WITH CHECK (true);
