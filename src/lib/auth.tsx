import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@updesh/shared-types';
import { api, setTokens, clearTokens } from './api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'buyer' | 'seller';
    preferredLocalities?: string[];
  }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth
      .me()
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch(() => {
        clearTokens();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.auth.login(identifier, password);
    setTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
    localStorage.setItem('user', JSON.stringify(res.user));
  };

  const signup = async (data: Parameters<AuthContextValue['signup']>[0]) => {
    const res = await api.auth.signup(data);
    setTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
    localStorage.setItem('user', JSON.stringify(res.user));
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller' || user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
