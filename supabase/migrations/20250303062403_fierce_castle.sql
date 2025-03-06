/*
  # Add admin flag to profiles table

  1. Changes
    - Add is_admin boolean column to profiles table with default false
    - Set shahrukhfiaz@gmail.com as super admin
    - Add policies for admin access
*/

-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set shahrukhfiaz@gmail.com as super admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'shahrukhfiaz@gmail.com';

-- Create policy to allow admins to update other users' admin status
CREATE POLICY "Admins can update user admin status"
  ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
      AND email = 'shahrukhfiaz@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
      AND email = 'shahrukhfiaz@gmail.com'
    )
  );
