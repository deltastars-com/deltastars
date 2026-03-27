const ADMIN_AUTH_KEY = 'delta-stars-admin-auth';

const getAdminAuth = () => {
  try {
    const data = localStorage.getItem(ADMIN_AUTH_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  
  const defaultAuth = { password: '***733691903***%', isDefault: true };
  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(defaultAuth));
  return defaultAuth;
};

export const mockApi = (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
  const path = typeof url === 'string' ? url : url.toString();
  const method = options?.method || 'GET';

  if (path === '/api/auth/token/' && method === 'POST') {
    if (options?.body) {
      const { username, password } = JSON.parse(options.body as string);
      const auth = getAdminAuth();

      const cleanUser = username.toLowerCase().trim();
      const cleanPass = password.trim();

      // التحقق من الايميلات الرسمية
      const isAdmin = cleanUser === 'marketing@deltastars-ksa.com' || cleanUser === 'deltastars@zoho.mail.com';

      // التحقق من كلمات المرور المخصصة
      const isCorrectPass =                                               
        (cleanUser === 'marketing@deltastars-ksa.com' && (cleanPass === '***733691903***%' || cleanPass === '%***733691903***')) ||         
        (cleanUser === 'deltastars@zoho.mail.com' && cleanPass === '321666');

      if (isAdmin && isCorrectPass) {
        return Promise.resolve(new Response(JSON.stringify({
          access: 'sovereign-token-' + Date.now(),
          isDefaultPassword: auth.isDefault
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }

      return Promise.resolve(new Response(JSON.stringify({ detail: 'Invalid credentials' }), {
        status: 401, headers: { 'Content-Type': 'application/json' }
      }));                                      
    }
  }

  return Promise.resolve(new Response('Not Found', { status: 404 }));
};                                      
