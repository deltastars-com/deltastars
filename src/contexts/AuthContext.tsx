import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithOtp: (phone: string) => Promise<void>;
  verifyOtpAndLogin: (phone: string, code: string) => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<{ needsPasswordChange: boolean }>;
  changePassword: (newPassword: string) => Promise<void>;
  logout: () => void;
  isRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'delta_stars_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithOtp = useCallback(async (phone: string) => {
    await api.sendOtp(phone, 'login');
  }, []);

  const verifyOtpAndLogin = useCallback(async (phone: string, code: string) => {
    setIsLoading(true);
    try {
      const { user: verifiedUser } = await api.verifyOtp(phone, code, 'login');
      setUser(verifiedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: loggedUser } = await api.loginWithPassword(email, password);
      setUser(loggedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      return { needsPasswordChange: loggedUser.force_password_change || false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (newPassword: string) => {
    if (!user) throw new Error('No user');
    await api.changePassword(user.id, newPassword);
    setUser(prev => prev ? { ...prev, force_password_change: false } : null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, force_password_change: false }));
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isRole = useCallback((roles: string | string[]) => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithOtp,
        verifyOtpAndLogin,
        loginWithPassword,
        changePassword,
        logout,
        isRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
