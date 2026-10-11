import { createContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

// Components import the context; this module also exports its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    authService.getUser()
      .then((data) => { if (active) { setUser(data); } })
      .catch((failure) => {
        if (active && failure.status !== 401) { setError('Could not check your login. Please refresh to try again.'); }
      })
      .finally(() => { if (active) { setLoading(false); } });
    return () => { active = false; };
  }, []);

  async function login(data) {
    const result = await authService.login(data);
    setUser(result.data);
    setError('');
  }

  async function register(data) {
    const result = await authService.register(data);
    setUser(result.data);
    setError('');
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>{children}</AuthContext.Provider>;
}
