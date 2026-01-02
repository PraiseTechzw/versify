// THIS IS A MOCK AUTH CONTEXT FOR UI DEVELOPMENT
// DO NOT USE IN PRODUCTION

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // In a real app, you'd check for a token in localStorage or a cookie
  // For this mock, we'll just start logged out.
  
  const login = async (email: string, pass: string) => {
    // Mock login
    if (email && pass) {
      const mockUser: User = {
        uid: 'mock-uid-123',
        email: email,
        displayName: 'Mock User',
        photoURL: `https://i.pravatar.cc/150?u=${email}`
      };
      setUser(mockUser);
      return;
    }
    throw new Error('Invalid credentials');
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    const mockUser: User = {
        uid: 'mock-google-uid-456',
        email: 'mock.user@google.com',
        displayName: 'Google User',
        photoURL: `https://i.pravatar.cc/150?u=google`
      };
    setUser(mockUser);
  }

  const signup = async (email: string, pass: string, displayName: string) => {
    // Mock signup
     if (email && pass && displayName) {
      const mockUser: User = {
        uid: 'mock-uid-new-789',
        email: email,
        displayName: displayName,
        photoURL: `https://i.pravatar.cc/150?u=${email}`
      };
      setUser(mockUser);
      return;
    }
    throw new Error('Signup failed');
  }

  const logout = () => {
    // Mock logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
