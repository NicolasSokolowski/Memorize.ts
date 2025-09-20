import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  allowedRoles: number[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, _persist } = useAppSelector(
    (state) => state.user
  );

  if (!_persist?.rehydrated || user === null) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }
  const roleId = user.role_id;
  if (!roleId || (allowedRoles && !allowedRoles.includes(roleId))) {
    return <Navigate to="/user/decks" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
