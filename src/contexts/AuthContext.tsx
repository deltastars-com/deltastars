import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { supabase } from '../lib/supabaseClient';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithOtp: (phone: string) => Promise<void>;
  verifyOtpAndLogin: (phone: string, code: string) => Promise<{ needsDeviceSave: boolean }>;
  loginWithSavedDevice: () => Promise<boolean>;
  saveDeviceAfterPurchase: () => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<{ needsPasswordChange: boolean }>;
  changePassword: (newPassword: string) => Promise<void>;
  registerBiometricForAdmin: () => Promise<void>;
  loginWithBiometricForAdmin: () => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'delta_stars_user';
const DEVICE_REGISTERED_KEY = 'delta_stars_device_registered';

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

  // Client OTP
  const loginWithOtp = useCallback(async (phone: string) => {
    await api.sendOtp(phone, 'login');
  }, []);

  const verifyOtpAndLogin = useCallback(async (phone: string, code: string) => {
    setIsLoading(true);
    try {
      const { user: verifiedUser } = await api.verifyOtp(phone, code, 'login');
      setUser(verifiedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedUser));
      const deviceRegistered = localStorage.getItem(`${DEVICE_REGISTERED_KEY}_${verifiedUser.id}`);
      return { needsDeviceSave: !deviceRegistered };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveDeviceAfterPurchase = useCallback(async () => {
    if (!user) throw new Error('No user');
    try {
      const options = await api.initiateDeviceRegistration(user.id);
      const credential = await startRegistration(options);
      await api.saveDevice(user.id, credential);
      localStorage.setItem(`${DEVICE_REGISTERED_KEY}_${user.id}`, 'true');
    } catch (error) {
      console.error('Device registration failed:', error);
    }
  }, [user]);

  const loginWithSavedDevice = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const deviceRegistered = localStorage.getItem(`${DEVICE_REGISTERED_KEY}_${user.id}`);
    if (!deviceRegistered) return false;
    try {
      const options = await api.getDeviceChallenge(user.id);
      const assertion = await startAuthentication(options);
      const verified = await api.verifyDeviceAssertion(user.id, assertion);
      return verified;
    } catch (error) {
      console.error('Auto login failed:', error);
      return false;
    }
  }, [user]);

  // Admin password
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

  // Admin biometric
  const registerBiometricForAdmin = useCallback(async () => {
    if (!user) throw new Error('No user');
    try {
      const options = await api.initiateBiometricRegistration(user.id);
      const credential = await startRegistration(options);
      await api.registerBiometric(user.id, credential);
      setUser(prev => prev ? { ...prev, biometric_enabled: true } : null);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, biometric_enabled: true }));
    } catch (error) {
      console.error('Biometric registration failed:', error);
      throw new Error('فشل في تسجيل البصمة');
    }
  }, [user]);

  const loginWithBiometricForAdmin = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    if (!user.biometric_enabled) return false;
    try {
      const options = await api.initiateBiometricLogin(user.id);
      const assertion = await startAuthentication(options);
      const verified = await api.verifyBiometricLogin(user.id, assertion);
      return verified;
    } catch (error) {
      console.error('Biometric login failed:', error);
      return false;
    }
  }, [user]);

  // General
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
        loginWithSavedDevice,
        saveDeviceAfterPurchase,
        loginWithPassword,
        changePassword,
        registerBiometricForAdmin,
        loginWithBiometricForAdmin,
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
