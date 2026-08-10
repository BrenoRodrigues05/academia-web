import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserRole } from "@/shared/enums/UserRole";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { token, user } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!user) {
        return null;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}