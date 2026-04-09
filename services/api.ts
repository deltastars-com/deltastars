async loginToAdminDashboard(username: string, password: string): Promise<{ user: User }> {
  const res = await fetch(`${EDGE_FUNCTION_URL}/auth-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
},

async changeAdminPassword(userId: string, newPassword: string): Promise<void> {
  const res = await fetch(`${EDGE_FUNCTION_URL}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, newPassword }),
  });
  if (!res.ok) throw new Error('Failed to change password');
},

async requestAdminPasswordReset(email: string): Promise<void> {
  const res = await fetch(`${EDGE_FUNCTION_URL}/reset-admin-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to send reset link');
},
