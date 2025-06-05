import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

interface User {
  _id: string; // Changed from id to _id for consistency
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const savedToken = authService.getToken();
      const savedUser = authService.getUser();

      if (savedToken && savedUser) {
        // Verify token is still valid
        const isValid = await authService.verifyToken(savedToken);
        
        if (isValid) {
          setToken(savedToken);
          setUser(savedUser);
        } else {
          // Token is invalid, clear everything
          logout();
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      if (response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};