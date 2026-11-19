import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('campusconnect_token')) {
      setLoading(false);
      return;
    }
    let active = true;
    api.get('/api/auth/me')
      .then(data => { if (active) setUser(data.user); })
      .catch(() => {
        if (active) localStorage.removeItem('campusconnect_token');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function signIn(email, password) {
    const data = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('campusconnect_token', data.token);
    setUser(data.user);
  }

  async function signUp(name, email, password) {
    const data = await api.post('/api/auth/register', { name, email, password });
    localStorage.setItem('campusconnect_token', data.token);
    setUser(data.user);
  }

  function signOut() {
    localStorage.removeItem('campusconnect_token');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be called within AuthProvider');
  return context;
}
