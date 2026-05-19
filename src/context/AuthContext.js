import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStorageItem('user', null));

  const login = (email, password) => {
    if (email && password) {
      const users = getStorageItem('users', []);
      const existingUser = users.find(u => u.email === email && u.password === password);

      if (existingUser) {
        // Create user object without password for session
        const sessionUser = { id: existingUser.id, name: existingUser.name, email: existingUser.email };
        setUser(sessionUser);
        setStorageItem('user', sessionUser);
        toast.success('Logged in successfully');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    }
    toast.error('Please enter email and password');
    return false;
  };

  const signup = (name, email, password) => {
    if (name && email && password) {
      const users = getStorageItem('users', []);
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        toast.error('Email already in use');
        return false;
      }

      const newUser = { id: Date.now(), name, email, password };
      users.push(newUser);
      setStorageItem('users', users);

      // Create user object without password for session
      const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
      setUser(sessionUser);
      setStorageItem('user', sessionUser);
      toast.success('Account created successfully');
      return true;
    }
    toast.error('Please fill all fields');
    return false;
  };

  const logout = () => {
    setUser(null);
    removeStorageItem('user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
