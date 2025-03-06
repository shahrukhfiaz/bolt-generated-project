import { User } from '../types';
import { supabase } from '../lib/supabase';
import { isSupabaseConnected } from '../lib/supabase';

const mockUsers: User[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: new Date(),
    isAdmin: false
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    username: 'shahrukhfiaz',
    email: 'shahrukhfiaz@gmail.com',
    createdAt: new Date(),
    isAdmin: true
  }
];

let currentUser: User | null = null;

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const connected = await isSupabaseConnected;
    
    if (connected) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('Registration failed');
      
      const newUser: User = {
        id: data.user.id,
        username,
        email: data.user.email || email,
        createdAt: new Date(data.user.created_at || Date.now()),
        isAdmin: false
      };
      
      currentUser = newUser;
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return newUser;
    } else {
      console.log('Using mock registration');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (mockUsers.some(user => user.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email,
        createdAt: new Date(),
        isAdmin: false
      };
      
      mockUsers.push(newUser);
      currentUser = newUser;
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return newUser;
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const connected = await isSupabaseConnected;
    
    if (connected) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('Login failed');
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', data.user.id)
        .single();
      
      const user: User = {
        id: data.user.id,
        username: profileData?.username || data.user.user_metadata?.username || email.split('@')[0],
        email: data.user.email || email,
        createdAt: new Date(data.user.created_at || Date.now()),
        isAdmin: email === 'shahrukhfiaz@gmail.com'
      };
      
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return user;
    } else {
      console.log('Using mock login');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const user = mockUsers.find(user => user.email === email);
      if (!user) throw new Error('Invalid email or password');
      
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return user;
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const connected = await isSupabaseConnected;
    
    if (connected) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      console.log('Using mock logout');
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    currentUser = null;
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.createdAt = new Date(parsedUser.createdAt);
      currentUser = parsedUser;
      return parsedUser;
    } catch (e) {
      console.error('Error parsing stored user:', e);
      localStorage.removeItem('currentUser');
    }
  }
  
  return null;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    const connected = await isSupabaseConnected;
    
    if (connected) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
    } else {
      console.log('Using mock password reset');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!mockUsers.some(user => user.email === email)) {
        throw new Error('No user found with this email');
      }
      
      console.log(`Password reset requested for ${email}`);
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    const connected = await isSupabaseConnected;
    
    if (connected) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
    } else {
      console.log('Using mock password reset');
      await new Promise(resolve => setTimeout(resolve, 700));
      console.log(`Password reset with token ${token}`);
    }
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const user = session.user;
    
    supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
      .then(({ data: profileData }) => {
        currentUser = {
          id: user.id,
          username: profileData?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'User',
          email: user.email || 'unknown@example.com',
          createdAt: new Date(user.created_at || Date.now())
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        
        currentUser = {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
          email: user.email || 'unknown@example.com',
          createdAt: new Date(user.created_at || Date.now())
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      });
  } else if (event === 'SIGNED_OUT') {
    currentUser = null;
    localStorage.removeItem('currentUser');
  }
});

export { supabase };
