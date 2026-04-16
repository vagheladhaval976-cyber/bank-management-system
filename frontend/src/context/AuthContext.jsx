import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check user details if token exists on load
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/account/details');
          setUser(res.data.data || res.data.account);
        } catch (err) {
          console.error('Failed to load user', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = (newToken, accountData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    if (accountData) {
      setUser(accountData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Used to update balance when a transaction happens
  const updateBalance = (newBalance) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};
