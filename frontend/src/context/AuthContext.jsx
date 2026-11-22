import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state synchronously from localStorage so page doesn't redirect on refresh!
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('joineazy_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('joineazy_token') || null);
  // If we already have stored user & token, don't block rendering
  const [loading, setLoading] = useState(() => !localStorage.getItem('joineazy_token'));

  // Background verification of token on load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('joineazy_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('joineazy_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          // Only log out if the token is explicitly invalid or expired (401)
          if (err.response && err.response.status === 401) {
            console.warn('Session expired. Logging out.');
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('joineazy_token', res.data.token);
      localStorage.setItem('joineazy_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('joineazy_token', res.data.token);
      localStorage.setItem('joineazy_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('joineazy_token');
    localStorage.removeItem('joineazy_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
