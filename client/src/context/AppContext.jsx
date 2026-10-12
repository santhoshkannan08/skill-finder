import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/index.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiFetch('/auth/me').then(({ user: currentUser }) => setUser(currentUser)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const logout = async () => { const { csrfToken } = await apiFetch('/auth/csrf'); await apiFetch('/auth/logout', { method: 'POST', headers: { 'x-csrf-token': csrfToken } }); setUser(null); };
  const value = useMemo(() => ({ user, setUser, logout, loading }), [user, loading]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
}
