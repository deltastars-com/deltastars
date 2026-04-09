import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../../api';
import { User } from '../../types';
import { supabase } from '../lib/supabaseClient';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Client
  loginWithOtp: (phone: string) => Promise<void>;
  verifyOtpAndLogin: (phone: string, code: string) => Promise<void>;
  // Admin Dashboard
  loginToAdminDashboard: (username: string, password: string) => Promise<{ success: boolean; needsPasswordChange?: boolean; error?: string }>;
  resetAdminPassword: () => Promise<void>;
  changeAdminPassword: (newPassword: string) => Promise<void>;
  // Developer (separate)
  // ... (سيتم إضافتها في سياق منفصل)
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'delta_stars_user';

// بيانات لوحة التحكم السرية (لا تظهر في الواجهة)
const ADMIN_SECRET_EMAIL = 'deltastars777@gmail.com';
const ADMIN_USERNAME = 'Delta Stars';
const ADMIN_INITIAL_PASSWORD = '$***733691903***$';

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

  // ========== Client OTP ==========
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

  // ========== Admin Dashboard ==========
  const loginToAdminDashboard = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // البحث عن المستخدم صاحب البريد السري ودور admin
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, force_password_change, password_hash')
        .eq('email', ADMIN_SECRET_EMAIL)
        .eq('role', 'admin')
        .single();

      if (error || !data) throw new Error('بيانات الدخول غير صحيحة');

      // التحقق من كلمة المرور (للتطوير نقبل الابتدائية، في الإنتاج استخدم bcrypt)
      let isValid = false;
      if (password === ADMIN_INITIAL_PASSWORD) isValid = true;
      // TODO: مقارنة مع password_hash باستخدام bcrypt
      
      if (!isValid) throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');

      const userData: User = {
        id: data.id,
        email: data.email,
        role: data.role,
        force_password_change: data.force_password_change || (password === ADMIN_INITIAL_PASSWORD),
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return { success: true, needsPasswordChange: userData.force_password_change };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetAdminPassword = useCallback(async () => {
    // إرسال طلب إلى Edge Function
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL}/reset-admin-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_SECRET_EMAIL }),
    });
    if (!response.ok) throw new Error('فشل إرسال رابط إعادة التعيين');
  }, []);

  const changeAdminPassword = useCallback(async (newPassword: string) => {
    if (!user) throw new Error('No user');
    await api.changePassword(user.id, newPassword);
    setUser(prev => prev ? { ...prev, force_password_change: false } : null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, force_password_change: false }));
  }, [user]);

  // ========== General ==========
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
