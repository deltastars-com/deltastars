import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithOtp: (phone: string) => Promise<void>;
  verifyOtpAndLogin: (phone: string, code: string) => Promise<void>;
  loginToAdminDashboard: (username: string, password: string) => Promise<{ success: boolean; needsPasswordChange?: boolean; error?: string }>;
  resetAdminPassword: (email: string) => Promise<void>;
  changeAdminPassword: (newPassword: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
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
      } catch (e) { console.error(e); }
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

  const loginToAdminDashboard = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL}/auth-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const { user: adminUser, needsPasswordChange } = await res.json();
      setUser(adminUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      return { success: true, needsPasswordChange };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetAdminPassword = useCallback(async (email: string) => {
    // Note: Assuming api.requestAdminPasswordReset is implemented elsewhere or meant to be a fetch.
    // If api doesn't have it, we need to add it or fix this later.
    // I'll just use the old code for now, maybe the user added it to api later.
    // wait, I'll use the original code from git show 06ee232
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL}/reset-admin-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Failed to reset password');
  }, []);

  const changeAdminPassword = useCallback(async (newPassword: string) => {
    if (!user) throw new Error('No user');
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL}/change-admin-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, newPassword }),
    });
    if (!res.ok) throw new Error('Failed to change password');

    setUser(prev => prev ? { ...prev, force_password_change: false } : null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, force_password_change: false }));
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, ...data }));
  }, [user]);

  const isRole = useCallback((roles: string | string[]) => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.type || user.role as any);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithOtp,
        verifyOtpAndLogin,
        loginToAdminDashboard,
        resetAdminPassword,
        changeAdminPassword,
        logout,
        updateUser,
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