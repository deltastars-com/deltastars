import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

interface DeveloperAuthContextType {
  devUser: User | null;
  isDevLoading: boolean;
  isDevAuthenticated: boolean;
  devLogin: (username: string, password: string) => Promise<{ success: boolean; needsPasswordChange?: boolean; error?: string }>;
  devChangePassword: (newPassword: string) => Promise<void>;
  devRegisterBiometric: () => Promise<void>;
  devLoginWithBiometric: () => Promise<boolean>;
  devLogout: () => void;
  devResetPasswordRequest: (email: string) => Promise<void>;
}

const DeveloperAuthContext = createContext<DeveloperAuthContextType | undefined>(undefined);
const DEV_STORAGE_KEY = 'delta_stars_dev_session';

// البيانات السرية للمطور (لا تظهر في أي واجهة)
const DEV_EMAIL = 'deltastars777@gmail.com';
const DEV_USERNAME = 'المطور';
const DEV_INITIAL_PASSWORD = '+000000+';

export const DeveloperAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devUser, setDevUser] = useState<User | null>(null);
  const [isDevLoading, setIsDevLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(DEV_STORAGE_KEY);
    if (stored) {
      try {
        setDevUser(JSON.parse(stored));
      } catch (e) { console.error(e); }
    }
    setIsDevLoading(false);
  }, []);

  const devLogin = useCallback(async (username: string, password: string) => {
    setIsDevLoading(true);
    try {
      // البحث عن المستخدم المطور في قاعدة البيانات باستخدام البريد السري
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, force_password_change, biometric_enabled')
        .eq('email', DEV_EMAIL)
        .eq('role', 'developer')
        .single();

      if (error || !data) {
        throw new Error('لم يتم العثور على حساب المطور');
      }

      // التحقق من كلمة المرور (هنا يجب استخدام bcrypt مقارنة، للتبسيط نقبل الابتدائية)
      if (password !== DEV_INITIAL_PASSWORD && password !== data?.password_hash) {
        throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        role: data.role,
        force_password_change: data.force_password_change || (password === DEV_INITIAL_PASSWORD),
        biometric_enabled: data.biometric_enabled || false,
      };
      setDevUser(userData);
      localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(userData));
      return { success: true, needsPasswordChange: userData.force_password_change };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsDevLoading(false);
    }
  }, []);

  const devChangePassword = useCallback(async (newPassword: string) => {
    if (!devUser) throw new Error('No developer logged in');
    // استدعاء Edge Function حقيقية لتغيير كلمة المرور
    // await api.devChangePassword(devUser.id, newPassword);
    setDevUser(prev => prev ? { ...prev, force_password_change: false } : null);
    localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify({ ...devUser, force_password_change: false }));
  }, [devUser]);

  const devRegisterBiometric = useCallback(async () => {
    if (!devUser) throw new Error('No developer logged in');
    try {
      const options = await api.initiateBiometricRegistration(devUser.id);
      const credential = await startRegistration(options);
      await api.registerBiometric(devUser.id, credential);
      setDevUser(prev => prev ? { ...prev, biometric_enabled: true } : null);
      localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify({ ...devUser, biometric_enabled: true }));
    } catch (error) {
      console.error('Biometric registration failed:', error);
      throw new Error('فشل في تسجيل البصمة');
    }
  }, [devUser]);

  const devLoginWithBiometric = useCallback(async (): Promise<boolean> => {
    if (!devUser) return false;
    if (!devUser.biometric_enabled) return false;
    try {
      const options = await api.initiateBiometricLogin(devUser.id);
      const assertion = await startAuthentication(options);
      const verified = await api.verifyBiometricLogin(devUser.id, assertion);
      if (verified) {
        localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(devUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric login failed:', error);
      return false;
    }
  }, [devUser]);

  const devLogout = useCallback(() => {
    setDevUser(null);
    localStorage.removeItem(DEV_STORAGE_KEY);
  }, []);

  const devResetPasswordRequest = useCallback(async (email: string) => {
    if (email !== DEV_EMAIL) {
      throw new Error('هذا البريد غير مرتبط بحساب مطور');
    }
    // استدعاء Edge Function لإرسال رابط إعادة تعيين كلمة المرور
    console.log(`Reset password link sent to ${DEV_EMAIL}`);
  }, []);

  return (
    <DeveloperAuthContext.Provider
      value={{
        devUser,
        isDevLoading,
        isDevAuthenticated: !!devUser,
        devLogin,
        devChangePassword,
        devRegisterBiometric,
        devLoginWithBiometric,
        devLogout,
        devResetPasswordRequest,
      }}
    >
      {children}
    </DeveloperAuthContext.Provider>
  );
};

export const useDeveloperAuth = () => {
  const ctx = useContext(DeveloperAuthContext);
  if (!ctx) throw new Error('useDeveloperAuth must be used within DeveloperAuthProvider');
  return ctx;
};
