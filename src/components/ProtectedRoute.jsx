import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Admin trying to access client pages → redirect to dashboard
  if (requiredRole === "client" && role === "admin") return <Navigate to="/admin" replace />;

  // Client trying to access admin pages → redirect to home
  if (requiredRole === "admin" && role !== "admin") return <Navigate to="/" replace />;

  // Generic protected route (no specific role required) - admin should go to dashboard
  if (!requiredRole && role === "admin") return <Navigate to="/admin" replace />;

  return <>{children}</>;
}
