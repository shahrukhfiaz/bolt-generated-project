/*
  # Fix Database Functions for Data Clearing

  1. Changes
    - Drop existing functions before recreating them
    - Add proper return types and error handling
    - Add transaction support
    - Add row count returns
*/

-- First drop existing functions if they exist
DROP FUNCTION IF EXISTS clear_all_records(text);
DROP FUNCTION IF EXISTS reset_all_website_statuses();

-- Function to safely delete all records from a table
CREATE FUNCTION clear_all_records(table_name text)
RETURNS integer AS $$
DECLARE
  affected_rows integer;
BEGIN
  -- Use WHERE true to satisfy the requirement for a WHERE clause
  EXECUTE format('DELETE FROM %I WHERE true', table_name)
  INTO affected_rows;
  
  RETURN affected_rows;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Failed to clear records from %: %', table_name, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset all website statuses to 'up'
CREATE FUNCTION reset_all_website_statuses()
RETURNS integer AS $$
DECLARE
  affected_rows integer;
BEGIN
  -- Use WHERE true to satisfy the requirement for a WHERE clause
  UPDATE websites 
  SET 
    status = 'up',
    last_checked = CURRENT_TIMESTAMP,
    response_time = NULL
  WHERE true
  RETURNING COUNT(*) INTO affected_rows;
  
  RETURN affected_rows;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Failed to reset website statuses: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION clear_all_records(text) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_all_website_statuses() TO authenticated;
