import { supabase } from '../lib/supabase';
import { User } from '../types';

/**
 * Get all users
 * @returns Promise with array of users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (users || []).map(user => ({
      id: user.id,
      username: user.username || '',
      email: user.email || '',
      createdAt: new Date(user.created_at)
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

/**
 * Get a user by ID
 * @param userId User ID
 * @returns Promise with user data
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!user) return null;

    return {
      id: user.id,
      username: user.username || '',
      email: user.email || '',
      createdAt: new Date(user.created_at)
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param email User email
 * @param password User password
 * @param username Username
 * @returns Promise with created user
 */
export const createUser = async (email: string, password: string, username: string): Promise<User> => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Profile is automatically created by the database trigger
    const user = authData.user;

    return {
      id: user.id,
      username,
      email: user.email || email,
      createdAt: new Date(user.created_at || Date.now())
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update a user
 * @param userId User ID
 * @param updates Updates to apply
 * @returns Promise with updated user
 */
export const updateUser = async (
  userId: string,
  updates: { username?: string; email?: string; isAdmin?: boolean }
): Promise<User> => {
  try {
    // Update profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        username: updates.username,
        email: updates.email,
        is_admin: updates.isAdmin,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('User not found');

    // If email is being updated, the user needs to update it themselves
    // through the auth system. We'll just update the profile.

    return {
      id: profile.id,
      username: profile.username || '',
      email: profile.email || '',
      isAdmin: profile.is_admin || false,
      createdAt: new Date(profile.created_at)
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param userId User ID
 * @returns Promise<void>
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // We can't delete auth users without admin privileges
    // Instead, we'll just mark the profile as inactive
    const { error } = await supabase
      .from('profiles')
      .update({ 
        active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
};
