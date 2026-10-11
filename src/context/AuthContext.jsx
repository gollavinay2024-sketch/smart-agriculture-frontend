import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore session on app load by calling /api/auth/me
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getCurrentUser();
      if (res && res.authenticated && res.user) {
        setUser(res.user);
      } else if (res && res.id) {
        setUser(res);
      } else {
        setUser(null);
      }
    } catch {
      // 401 or network error - user is unauthenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.login({ email, password });
      if (res && res.user) {
        setUser(res.user);
        return res.user;
      } else if (res && res.id) {
        setUser(res);
        return res;
      }
      throw new Error('Unexpected response during login');
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    }
  };

  // Signup handler
  const signup = async (formData) => {
    setAuthError(null);
    try {
      const res = await api.signup(formData);
      return res;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout errors and clear state
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    signup,
    logout,
    refreshUser: checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
