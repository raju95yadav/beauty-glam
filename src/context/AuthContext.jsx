import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Verify authentication session with backend server
          const response = await api.get('/users/profile');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Authentication verification failed:', error);
          // Clear session if server is stopped, unreachable, or token is invalid
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to register:', error);
      throw error;
    }
  };

  const updateUser = async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      const updatedUser = response.data;
      
      // Merge with existing user data to preserve fields not returned by API
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const newUserData = { ...currentUser, ...updatedUser };
      
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
