import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  allowedRoles: number[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const roleId = user.role_id;
  if (!roleId || (allowedRoles && !allowedRoles.includes(roleId))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
