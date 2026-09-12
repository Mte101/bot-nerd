import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchAPI, setToken as storeToken, clearToken } from './api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      fetchAPI('/api/auth/me')
        .then((data) => setUser(data))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token: string): Promise<void> => {
    storeToken(token);
    const me = await fetchAPI('/api/auth/me');
    setUser(me);
  };

  const logout = (): void => {
    clearToken();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    const me = await fetchAPI('/api/auth/me');
    setUser(me);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
