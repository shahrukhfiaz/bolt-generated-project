/*
  # Fix Row Level Security Policies

  1. Changes
    - Update RLS policies for incidents table to allow anonymous inserts
    - Update RLS policies for outage_reports table to allow anonymous inserts
    - Add explicit policies for anonymous users
  
  2. Security
    - Maintain read access for all users
    - Allow anonymous users to insert data
*/

-- Drop existing policies for incidents table
DROP POLICY IF EXISTS "Allow anonymous read access to incidents" ON incidents;
DROP POLICY IF EXISTS "Allow authenticated read access to incidents" ON incidents;
DROP POLICY IF EXISTS "Allow authenticated insert to incidents" ON incidents;

-- Create new policies for incidents table
CREATE POLICY "Allow public read access to incidents"
  ON incidents
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to incidents"
  ON incidents
  FOR INSERT
  WITH CHECK (true);

-- Drop existing policies for outage_reports table
DROP POLICY IF EXISTS "Allow anonymous read access to outage_reports" ON outage_reports;
DROP POLICY IF EXISTS "Allow authenticated read access to outage_reports" ON outage_reports;
DROP POLICY IF EXISTS "Allow authenticated insert to outage_reports" ON outage_reports;

-- Create new policies for outage_reports table
CREATE POLICY "Allow public read access to outage_reports"
  ON outage_reports
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to outage_reports"
  ON outage_reports
  FOR INSERT
  WITH CHECK (true);
