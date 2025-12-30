import React, {createContext, useContext, useState, useEffect} from 'react';
import type {User} from '../types/api';
import {getToken, getUser, setUser, removeUser, setToken, removeToken} from '../services/storage';
import {apiClient} from '../services/apiClient';
import {authHandler} from '../services/authHandler';
import {navigationService} from '../services/navigationService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWith2FA: (email: string, password: string, code: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    default_currency?: string;
    language?: string;
  }) => Promise<void>;
  socialLogin: (data: {
    provider: string;
    provider_id: string;
    email: string;
    name: string;
    avatar?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        // Verify token is still valid by fetching user
        const userData = await apiClient.getCurrentUser();
        await setUser(userData);
        setUserState(userData);
        setIsAuthenticated(true);
      } else {
        // Try to load cached user
        const cachedUser = await getUser();
        if (cachedUser) {
          setUserState(cachedUser);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token invalid, clear storage
      await removeToken();
      await removeUser();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await apiClient.login(email, password);
      
      // Check if 2FA is required (shouldn't happen here as apiClient throws error, but just in case)
      if (data.requires_2fa) {
        throw new Error('2FA_REQUIRED');
      }
      
      await setToken(data.token);
      await setUser(data.user);
      setUserState(data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      // Re-throw 2FA_REQUIRED error so Login screen can handle it
      if (error.message === '2FA_REQUIRED') {
        throw error;
      }
      // For other errors, throw with original message
      throw new Error(error.message || 'Login failed');
    }
  };

  const loginWith2FA = async (email: string, password: string, code: string) => {
    const data = await apiClient.verify2FALogin({email, password, code});
    await setToken(data.token);
    await setUser(data.user);
    setUserState(data.user);
    setIsAuthenticated(true);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    default_currency?: string;
    language?: string;
  }) => {
    const result = await apiClient.register(data);
    await setToken(result.token);
    await setUser(result.user);
    setUserState(result.user);
    setIsAuthenticated(true);
  };

  const socialLogin = async (data: {
    provider: string;
    provider_id: string;
    email: string;
    name: string;
    avatar?: string;
  }) => {
    const result = await apiClient.socialLogin(data);
    await setToken(result.token);
    await setUser(result.user);
    setUserState(result.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    await removeToken();
    await removeUser();
    setUserState(null);
    setIsAuthenticated(false);
    
    // Navigate to Auth screen after logout
    navigationService.navigateToAuth();
  };

  // Register logout handler for global 401 handling
  useEffect(() => {
    authHandler.setUnauthenticatedHandler(async () => {
      // Clear user state without calling API (to avoid circular calls)
      await removeUser();
      setUserState(null);
      setIsAuthenticated(false);
      // Navigation will be handled by navigateToAuth() called from api.ts
    });
  }, []);

  const logoutAll = async () => {
    try {
      await apiClient.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    }
    await removeToken();
    await removeUser();
    setUserState(null);
    setIsAuthenticated(false);
    
    // Navigate to Auth screen after logout
    navigationService.navigateToAuth();
  };

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      await setUser(userData);
      setUserState(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        loginWith2FA,
        register,
        socialLogin,
        logout,
        logoutAll,
        refreshUser,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

