import { Navigate, Outlet } from "react-router-dom";

import { isAuthenticated } from "../services/authService.js";

function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;