/*
  # Add active flag to profiles table

  1. Changes
    - Add active boolean column to profiles table with default true
    - Add active column to existing rows
    - Add policy to only show active profiles by default
*/

-- Add active column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Update existing rows to have active = true
UPDATE profiles SET active = true WHERE active IS NULL;

-- Create policy to only show active profiles by default
CREATE POLICY "Show only active profiles by default"
  ON profiles
  FOR SELECT
  USING (active = true OR auth.uid() = id);

-- Allow users to update their own active status
CREATE POLICY "Users can update their own active status"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
