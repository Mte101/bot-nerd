const API = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8001';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAPI(path: string, options?: RequestInit): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });

  // Auto-logout on 401 from any protected endpoint
  if (res.status === 401 && !path.includes('/api/auth/login') && !path.includes('/api/auth/register')) {
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Session expired. Please sign in again.');
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.detail ?? body?.message ?? JSON.stringify(body);
    } catch {
      message = await res.text().catch(() => message);
    }
    throw new Error(message);
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) return res.json();
  return res.text();
}

export const setToken = (t: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', t);
  document.cookie = `token=${t}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const clearToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  document.cookie = 'token=; path=/; max-age=0';
};

export const getToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;
