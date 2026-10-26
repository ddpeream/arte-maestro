import { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import {
  getCurrentUser,
  onAuthStateChange,
  signIn,
  signOut
} from "../api/authService";
import { getActiveStaff } from "../api/authAccessService";

// Mantiene sincronizados el usuario autenticado y su acceso administrativo.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Actualiza usuario y permisos internos.
  async function syncAuth(nextUser) {
    setUser(nextUser);

    if (!nextUser) {
      setStaff(null);
      return;
    }

    const activeStaff = await getActiveStaff(nextUser.id);
    setStaff(activeStaff);
  }

  // Vuelve a consultar los permisos del usuario actual.
  async function refreshAccess() {
    if (!user) {
      setStaff(null);
      return null;
    }

    const activeStaff = await getActiveStaff(user.id);
    setStaff(activeStaff);

    return activeStaff;
  }

  // Recupera la autenticación inicial y escucha cambios posteriores.
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const currentUser = await getCurrentUser();

        if (mounted) {
          await syncAuth(currentUser);
        }
      } catch {
        if (mounted) {
          setUser(null);
          setStaff(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    const unsubscribe = onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;

      void syncAuth(nextUser).catch(() => {
        setStaff(null);
      });
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Inicia sesión y valida el acceso interno del usuario.
async function login(email, password) {
  const authData = await signIn(email, password);
  const nextUser = authData.user;

  if (!nextUser) {
    throw new Error("No se pudo obtener el usuario autenticado.");
  }

  const activeStaff = await getActiveStaff(nextUser.id);

  if (!activeStaff) {
    await signOut();

    setUser(null);
    setStaff(null);

    throw new Error("UNAUTHORIZED_STAFF");
  }

  setUser(nextUser);
  setStaff(activeStaff);

  return {
    user: nextUser,
    staff: activeStaff,
  };
}

// Cierra la sesión y limpia el estado administrativo.
async function logout() {
  await signOut();

  setUser(null);
  setStaff(null);
}

  const value = {
    user,
    staff,
    isLoading,
    isAuthenticated: Boolean(user),
    hasPanelAccess: Boolean(staff),
    refreshAccess,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
