-- First drop existing functions if they exist
DROP FUNCTION IF EXISTS clear_all_records(text);
DROP FUNCTION IF EXISTS reset_all_website_statuses();

-- Function to safely delete all records from a table
CREATE FUNCTION clear_all_records(table_name text)
RETURNS integer AS $$
DECLARE
  affected_rows integer;
BEGIN
  -- Validate table name exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = table_name
  ) THEN
    RAISE EXCEPTION 'Table % does not exist', table_name;
  END IF;

  -- Delete all records and get count
  EXECUTE format('
    WITH deleted AS (
      DELETE FROM %I 
      RETURNING 1
    )
    SELECT count(*) FROM deleted
  ', table_name) INTO affected_rows;

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
  -- Update all websites and get count
  WITH updated AS (
    UPDATE websites 
    SET 
      status = 'up',
      last_checked = CURRENT_TIMESTAMP,
      response_time = NULL
    RETURNING 1
  )
  SELECT count(*) INTO affected_rows FROM updated;

  RETURN affected_rows;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Failed to reset website statuses: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION clear_all_records(text) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_all_website_statuses() TO authenticated;
