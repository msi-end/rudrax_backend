import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

// Mock users with different roles
const MOCK_USERS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    data: {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      permissions: ['all'],
    }
  },
  user: {
    username: 'user',
    password: 'user123',
    role: 'user',
    data: {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      permissions: ['read', 'write'],
    }
  },
  manager: {
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    data: {
      id: '3',
      username: 'manager',
      email: 'manager@example.com',
      name: 'Manager User',
      role: 'manager',
      permissions: ['read', 'write', 'manage'],
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Check if user exists in mock data
      const mockUser = MOCK_USERS[username.toLowerCase()];
      
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Invalid username or password');
      }

      // Successful login
      setUser(mockUser.data);
      setLoading(false);
      return { success: true, role: mockUser.data.role };
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  const isRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user: user,
    loading: loading,
    error: error,
    login: login,
    logout: logout,
    updateUser: updateUser,
    hasPermission: hasPermission,
    isRole: isRole,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};