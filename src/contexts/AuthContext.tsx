import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      setIsSuperAdmin(currentUser.email === 'shahrukhfiaz@gmail.com');
      setIsAdmin(currentUser.isAdmin || currentUser.email === 'shahrukhfiaz@gmail.com');
    }
    
    setLoading(false);
    
    const { data: { subscription } } = authService.supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const updatedUser = authService.getCurrentUser();
          setUser(updatedUser);
          
          if (updatedUser) {
            setIsSuperAdmin(updatedUser.email === 'shahrukhfiaz@gmail.com');
            setIsAdmin(updatedUser.isAdmin || updatedUser.email === 'shahrukhfiaz@gmail.com');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsSuperAdmin(false);
          setIsAdmin(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      
      if (loggedInUser && loggedInUser.email === 'shahrukhfiaz@gmail.com') {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const newUser = await authService.register(username, email, password);
      setUser(newUser);
      
      if (newUser && newUser.email === 'shahrukhfiaz@gmail.com') {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    await authService.requestPasswordReset(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await authService.resetPassword(token, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSuperAdmin,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
