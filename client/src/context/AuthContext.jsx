// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(() => localStorage.getItem('accessToken') || '');
  const [refresh, setRefresh] = useState(() => localStorage.getItem('refreshToken') || '');
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);

  // ——— Helpers ———
  const saveTokens = (accessToken, refreshToken) => {
    setAccess(accessToken || '');
    setRefresh(refreshToken || '');
    if (accessToken) localStorage.setItem('accessToken', accessToken); else localStorage.removeItem('accessToken');
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken); else localStorage.removeItem('refreshToken');
  };

  const scheduleRefresh = () => {
    // Renueva access token de forma preventiva ~5 min antes de 1h (o del tiempo que uses)
    // Si usas 30m, ajusta a ~25m. Aquí 55m.
    clearTimeout(refreshTimer.current);
    if (!refresh) return;
    refreshTimer.current = setTimeout(async () => {
      try {
        const { accessToken } = await api.refresh(refresh);
        saveTokens(accessToken, refresh);
        const { user } = await api.me(accessToken);
        setUser(user);
      } catch {
        // si falla el refresh, cerrar sesión silenciosamente
        logout();
      }
    }, 55 * 60 * 1000);
  };

  // ——— Cargar/validar sesión al montar y cuando cambian tokens ———
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        if (access) {
          const { user } = await api.me(access);
          if (!alive) return;
          setUser(user);
          scheduleRefresh();
        } else if (refresh) {
          // intentar refresh si no hay access
          const { accessToken } = await api.refresh(refresh);
          if (!alive) return;
          saveTokens(accessToken, refresh);
          const { user } = await api.me(accessToken);
          if (!alive) return;
          setUser(user);
          scheduleRefresh();
        } else {
          // no hay sesión
          setUser(null);
        }
      } catch {
        // tokens inválidos -> limpiar sesión
        logout();
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // Reaccionar cuando access/refresh cambian
  }, [access, refresh]); // ← importante

  // ——— API públicas del contexto ———
  const login = async (email, password) => {
    const { user, accessToken, refreshToken } = await api.login({ email, password });
    setUser(user);
    saveTokens(accessToken, refreshToken);
    scheduleRefresh();
  };

  const logout = () => {
    setUser(null);
    saveTokens('', '');
    clearTimeout(refreshTimer.current);
  };

  const value = useMemo(
    () => ({
      user,
      access,
      token: access,           // alias para compatibilidad
      refresh,
      isAuthenticated: !!user, // útil en componentes
      loading,
      login,
      logout,
    }),
    [user, access, refresh, loading]
  );

  useEffect(() => {
    // cleanup de timer al desmontar
    return () => clearTimeout(refreshTimer.current);
  }, []);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
