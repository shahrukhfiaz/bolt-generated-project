import { supabaseAdmin } from './supabase-admin';

export const testSupabaseConnection = async () => {
  try {
    // Test connection by creating a test table
    const { data, error } = await supabaseAdmin
      .from('test_table')
      .insert([{ test_column: 'connection_test' }])
      .select();

    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }

    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};

// Run the test
testSupabaseConnection();
