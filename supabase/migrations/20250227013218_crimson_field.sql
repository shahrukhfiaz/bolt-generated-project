/*
  # Clear outage data

  1. Changes
    - Delete all records from the incidents table
    - Delete all records from the outage_reports table
    - Reset any sequences associated with these tables
  2. Purpose
    - Clear all user reports and outage data while preserving table structure
    - Maintain website data in the websites table
*/

-- Clear all data from the incidents table
DELETE FROM incidents;

-- Clear all data from the outage_reports table
DELETE FROM outage_reports;

-- Reset the sequence for incidents table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'incidents_id_seq'
    AND n.nspname = 'public'
  ) THEN
    ALTER SEQUENCE incidents_id_seq RESTART WITH 1;
  END IF;
END $$;

-- Reset the sequence for outage_reports table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'outage_reports_id_seq'
    AND n.nspname = 'public'
  ) THEN
    ALTER SEQUENCE outage_reports_id_seq RESTART WITH 1;
  END IF;
END $$;
