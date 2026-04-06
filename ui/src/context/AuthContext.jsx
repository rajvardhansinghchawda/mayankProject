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

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login/', {
        email: identifier, // Corrected to 'email' to match backend USERNAME_FIELD
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
      // Backend returns errors in 'error' or 'detail' field
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || 'Invalid credentials';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Clear local state first for immediate UI responsiveness
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    
    // Call backend to blacklist the refresh token if it exists
    if (refreshToken) {
      api.post('/auth/logout/', {
         refresh_token: refreshToken
      }).catch(err => console.error("Failed to blacklist token", err));
    }
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
