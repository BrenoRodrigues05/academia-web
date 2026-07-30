import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserRole } from "@/shared/enums/UserRole";

type Props = {
    children: React.ReactNode;
    roles?: UserRole[];
};

export default function ProtectedRoute({
    children,
    roles,
}: Props) {

    const { token, user } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (
        roles &&
        (!user || !roles.includes(user.role))
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}