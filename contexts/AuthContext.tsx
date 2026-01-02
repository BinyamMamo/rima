'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

interface AuthContextType {
  user: User | null;
  isDemoMode: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  skipSignIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Sara',
  email: 'sara@rima.app',
  avatarColor: '#6C30FF',
};

const STORAGE_KEYS = {
  DEMO_MODE: 'rima_demo_mode',
  USER_DATA: 'rima_user_data',
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedDemoMode = localStorage.getItem(STORAGE_KEYS.DEMO_MODE);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedDemoMode === 'true') {
          setIsDemoMode(true);
          setUser(DEMO_USER);
        } else if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsDemoMode(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const skipSignIn = () => {
    setIsDemoMode(true);
    setUser(DEMO_USER);
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(DEMO_USER));
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, accept any credentials (simulated auth)
      const mockUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        avatarColor: '#6C30FF',
      };

      setUser(mockUser);
      setIsDemoMode(false);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
      localStorage.removeItem(STORAGE_KEYS.DEMO_MODE);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: 'user-' + Date.now(),
        name,
        email,
        avatarColor: '#6C30FF',
      };

      setUser(mockUser);
      setIsDemoMode(false);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
      localStorage.removeItem(STORAGE_KEYS.DEMO_MODE);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Firebase Google Auth in Phase 4
      // For now, create a mock Google user
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: 'google-user-' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        avatarColor: '#EA4335',
      };

      setUser(mockUser);
      setIsDemoMode(false);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
      localStorage.removeItem(STORAGE_KEYS.DEMO_MODE);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.DEMO_MODE);
  };

  const value: AuthContextType = {
    user,
    isDemoMode,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    skipSignIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
