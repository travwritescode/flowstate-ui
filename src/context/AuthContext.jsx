import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));

  function saveToken(newToken) {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('access_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, saveToken, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
