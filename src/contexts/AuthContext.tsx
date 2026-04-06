// داخل AuthContext
const loginWithPassword = useCallback(async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const result = await api.loginWithPassword(email, password);
    setUser(result.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
    return { needsPasswordChange: result.user.force_password_change };
  } finally { setIsLoading(false); }
}, []);

const changePassword = useCallback(async (userId: string, newPassword: string) => {
  await api.changePassword(userId, newPassword);
  setUser(prev => prev ? { ...prev, force_password_change: false } : null);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, force_password_change: false }));
}, [user]);

const loginWithOtp = useCallback(async (phone: string) => {
  await api.sendOtp(phone, 'login');
}, []);

const verifyOtpAndLogin = useCallback(async (phone: string, code: string) => {
  setIsLoading(true);
  try {
    const { user } = await api.verifyOtp(phone, code, 'login');
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } finally { setIsLoading(false); }
}, []);
