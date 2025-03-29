
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  redirectAuthenticated?: boolean;
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  redirectAuthenticated = false,
  redirectPath = '/dashboard' 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // For login, register pages - redirect already authenticated users
  if (redirectAuthenticated && user) {
    return <Navigate to={redirectPath} replace />;
  }

  // For protected pages - redirect unauthenticated users
  if (!redirectAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  // For role-protected pages - check if user has required role
  if (
    requiredRoles.length > 0 && 
    user && 
    !requiredRoles.includes(user.role)
  ) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
