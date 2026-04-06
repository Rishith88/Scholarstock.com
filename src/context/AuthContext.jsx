import { createContext, useContext, useState } from 'react';
import API_URL from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const isLoggedIn = !!token;

  function setAuth(newToken, newUser) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  async function login(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setAuth(data.token, data.user);
      return { success: true };
    }
    return { success: false, message: data.message || 'Login failed' };
  }

  async function signup(name, email, password, referredByUsername = '') {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, referredByUsername }),
    });
    const data = await res.json();
    if (res.ok) {
      setAuth(data.token, data.user);
      return { success: true, referred: !!referredByUsername };
    }
    return { success: false, message: data.message || 'Signup failed' };
  }

  function logout() {
    clearAuth();
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, signup, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
