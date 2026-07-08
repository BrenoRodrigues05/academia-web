import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { AuthContext } from "./AuthContext";
import authService from "../services/authService";
import tokenStorage from "../storage/tokenStorage";

import type {
  LoginRequest,
} from "../types/auth";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({
  children,
}: Props) {
  const [token, setToken] =
    useState<string | null>(null);

  useEffect(() => {
    const storedToken = tokenStorage.get();

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  async function login(
    data: LoginRequest
  ) {
    const response =
      await authService.login(data);

    tokenStorage.save(response.token);

    setToken(response.token);
  }

  function logout() {
    tokenStorage.remove();

    setToken(null);
  }

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}