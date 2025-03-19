import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple storage keys
const USER_STORAGE_KEY = 'journal_user';
const TOKEN_STORAGE_KEY = 'journal_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll simulate an API call
      if (!email || !password) {
        throw new Error('Please provide both email and password');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple validation
      if (password.length < 6) {
        throw new Error('Invalid credentials');
      }

      // Create mock user
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0], // Use part of email as name
      };

      // Store user data
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, 'mock_token_' + mockUser.id);
      
      setUser(mockUser);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        throw new Error('Please fill in all fields');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock user
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
      };

      // Store user data
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, 'mock_token_' + mockUser.id);
      
      setUser(mockUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    // Clear stored data
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 