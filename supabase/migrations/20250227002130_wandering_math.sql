/*
  # Fix RLS Policies

  1. Changes
    - Safely drop and recreate policies for incidents and outage_reports tables
    - Ensure policies don't already exist before creating them
    - Allow public access for both read and write operations
*/

-- First check if policies exist before dropping them
DO $$
BEGIN
    -- Drop incidents policies if they exist
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
    
    -- Drop old policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'incidents' AND policyname = 'Allow anonymous read access to incidents'
    ) THEN
        DROP POLICY "Allow anonymous read access to incidents" ON incidents;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'incidents' AND policyname = 'Allow authenticated read access to incidents'
    ) THEN
        DROP POLICY "Allow authenticated read access to incidents" ON incidents;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'incidents' AND policyname = 'Allow authenticated insert to incidents'
    ) THEN
        DROP POLICY "Allow authenticated insert to incidents" ON incidents;
    END IF;
    
    -- Drop outage_reports policies if they exist
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
    
    -- Drop old policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'outage_reports' AND policyname = 'Allow anonymous read access to outage_reports'
    ) THEN
        DROP POLICY "Allow anonymous read access to outage_reports" ON outage_reports;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'outage_reports' AND policyname = 'Allow authenticated read access to outage_reports'
    ) THEN
        DROP POLICY "Allow authenticated read access to outage_reports" ON outage_reports;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'outage_reports' AND policyname = 'Allow authenticated insert to outage_reports'
    ) THEN
        DROP POLICY "Allow authenticated insert to outage_reports" ON outage_reports;
    END IF;
END $$;

-- Now create the new policies
DO $$
BEGIN
    -- Create new policies for incidents table
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'incidents' AND policyname = 'Allow public read access to incidents'
    ) THEN
        CREATE POLICY "Allow public read access to incidents"
          ON incidents
          FOR SELECT
          USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'incidents' AND policyname = 'Allow public insert to incidents'
    ) THEN
        CREATE POLICY "Allow public insert to incidents"
          ON incidents
          FOR INSERT
          WITH CHECK (true);
    END IF;
    
    -- Create new policies for outage_reports table
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'outage_reports' AND policyname = 'Allow public read access to outage_reports'
    ) THEN
        CREATE POLICY "Allow public read access to outage_reports"
          ON outage_reports
          FOR SELECT
          USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'outage_reports' AND policyname = 'Allow public insert to outage_reports'
    ) THEN
        CREATE POLICY "Allow public insert to outage_reports"
          ON outage_reports
          FOR INSERT
          WITH CHECK (true);
    END IF;
END $$;
