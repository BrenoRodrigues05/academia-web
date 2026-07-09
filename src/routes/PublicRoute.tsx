import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: Props) {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}