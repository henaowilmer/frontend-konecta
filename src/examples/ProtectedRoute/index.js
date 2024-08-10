import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, isAdmin, redirectPath = "/auth/login", children }) => {

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
