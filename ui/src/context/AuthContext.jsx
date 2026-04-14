import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Auth state from localStorage/API
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me/');
        // Backend wraps the profile in a 'data' key, let's be robust
        const userData = response.data.data || response.data;
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user session', err);
        // Do not clear tokens here, the interceptor handles that if it's a 401
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for unauthorized events to clear global state
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth_unauthorized', handleUnauthorized);
    };
  }, []);

  const normalizeErrorMessage = (payload, fallback = 'Something went wrong') => {
    if (!payload) return fallback;
    if (typeof payload === 'string') return payload;
    if (Array.isArray(payload)) return payload.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ');
    if (typeof payload === 'object') {
      if (typeof payload.error === 'string') return payload.error;
      if (typeof payload.detail === 'string') return payload.detail;
      if (typeof payload.message === 'string') return payload.message;
      try {
        return JSON.stringify(payload);
      } catch {
        return fallback;
      }
    }
    return String(payload);
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login/', {
        identifier,
        email: identifier,
        password: password
      });
      
      // Handle the backend's wrapped response structure
      const { access, refresh } = response.data.data;
      
      // Store tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Fetch user profile from the response
      const userData = response.data.data?.user || response.data.data;
      setUser(userData);
      
      return userData;
    } catch (err) {
      console.error('Login failed', err);
      const errorPayload = err.response?.data;
      const errorMessage = normalizeErrorMessage(
        errorPayload?.error || errorPayload?.detail || errorPayload?.errors || errorPayload,
        'Invalid credentials'
      );
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    // Call backend to blacklist the refresh token if it exists
    if (refreshToken) {
      try {
        await api.post('/auth/logout/', {
         refresh_token: refreshToken
        });
      } catch (err) {
        console.error('Failed to blacklist token', err);
      }
    }

    // Clear local state regardless of backend outcome
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
