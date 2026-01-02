"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { 
    useUser, 
    type User, 
    login as firebaseLogin, 
    loginWithGoogle as firebaseLoginWithGoogle, 
    signup as firebaseSignup, 
    logout as firebaseLogout 
} from '@/firebase';


interface AuthContextType {
  user: User | null;
  login: typeof firebaseLogin;
  loginWithGoogle: typeof firebaseLoginWithGoogle;
  signup: typeof firebaseSignup;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();

  const logout = () => {
    firebaseLogout();
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login: firebaseLogin, loginWithGoogle: firebaseLoginWithGoogle, signup: firebaseSignup, logout }}>
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
