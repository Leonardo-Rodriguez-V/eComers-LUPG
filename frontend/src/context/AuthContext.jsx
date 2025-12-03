import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuth } from '../services/api';

// AuthContext: provee user, token, loading, login, logout, hasRole, setUser, updateProfile
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar desde localStorage y/o backend /me
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken) {
        setAuth(savedToken);
        setToken(savedToken);
      }

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      }

      // Si tenemos token pero no user completo, intentar pedir /me al backend
      if (savedToken && !savedUser) {
        try {
          const res = await api.get('/auth/me');
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          // no fatal: puede que el backend no tenga /me
          console.warn('AuthProvider: /auth/me failed', err?.message || err);
          // en caso de 401 podrías limpiar token
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await api.post('/auth/login', { usernameOrEmail, password });
    const data = res.data;
    if (data?.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      setAuth(data.token);
      setToken(data.token);
      setUser(data.user || {});
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
    setToken(null);
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || (Array.isArray(user.roles) && user.roles.includes(role));
  };

  // Expose setUser to allow components to update the context directly
  const updateLocalUser = (newUser) => {
    setUser(newUser);
    try {
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      console.warn('updateLocalUser: could not save user to localStorage', err);
    }
  };

  // updateProfile: intenta llamar al backend (/auth/profile) y actualiza contexto/localStorage.
  // Si el backend no existe o falla, hace un fallback local.
  const updateProfile = async (payload) => {
    // payload example: { nombre, fechaNacimiento } or { username, birthdate }
    // Normalize possible keys
    const body = {
      ...(payload.nombre ? { nombre: payload.nombre } : {}),
      ...(payload.fechaNacimiento ? { fechaNacimiento: payload.fechaNacimiento } : {}),
      ...(payload.username ? { username: payload.username } : {}),
      ...(payload.birthdate ? { birthdate: payload.birthdate } : {}),
    };

    // Try server update first if we have token
    if (token) {
      try {
        const res = await api.put('/auth/profile', body);
        if (res?.data) {
          updateLocalUser(res.data);
          return res.data;
        }
      } catch (err) {
        // si falla, seguimos al fallback
        console.warn('updateProfile: backend update failed, falling back to local update', err?.message || err);
      }
    }

    // Fallback local update: merge into current user and persist in localStorage
    const merged = { ...(user || {}), ...body };
    updateLocalUser(merged);
    return merged;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole, setUser: updateLocalUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}