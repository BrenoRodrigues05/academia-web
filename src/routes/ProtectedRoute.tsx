import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {

  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}