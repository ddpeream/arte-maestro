import { Navigate } from "react-router";

import { useAuth } from "../hooks/useAuth";

// Protege las vistas administrativas según la sesión y el acceso del staff.
function AdminRoute({ children }) {
  const { isLoading, isAuthenticated, hasPanelAccess } = useAuth();

  if (isLoading) {
    return <div className="admin-auth-loading">Verificando acceso...</div>;
  }

  if (!isAuthenticated || !hasPanelAccess) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRoute;
