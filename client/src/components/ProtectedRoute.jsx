import { Navigate } from "react-router-dom";

// Wrap a page in this to require a login (and optionally a role)
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.type !== role) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;