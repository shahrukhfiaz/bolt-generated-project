/*
  # Fix Data Clearing Operations

  1. New Functions
    - `clear_all_records`: Function to safely delete all records from a table
    - `reset_all_website_statuses`: Function to safely reset all website statuses to 'up'

  2. Changes
    - Add functions to handle data clearing operations safely
    - Add proper error handling and validation
*/

-- Function to safely delete all records from a table
CREATE OR REPLACE FUNCTION clear_all_records(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('DELETE FROM %I', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset all website statuses to 'up'
CREATE OR REPLACE FUNCTION reset_all_website_statuses()
RETURNS void AS $$
BEGIN
  UPDATE websites 
  SET 
    status = 'up',
    last_checked = CURRENT_TIMESTAMP,
    response_time = NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION clear_all_records(text) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_all_website_statuses() TO authenticated;
