import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { AuthContext } from "./AuthContext";
import authService from "../services/authService";
import tokenStorage from "../storage/tokenStorage";
import UserService from "../services/UserService";

import type {
  LoginRequest,
} from "../types/auth";
import type { User } from "../types/User";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({
  children,
}: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadStorageData() {
    const storedToken = tokenStorage.get();

    if (storedToken) {
      setToken(storedToken);
    try {
        const loggedUser = await UserService.me();
        setUser(loggedUser);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        logout(); 
      }
    }
  }

  loadStorageData();
}, []);

  async function login(
    data: LoginRequest
  ) {
    const response =
      await authService.login(data);

    tokenStorage.save(response.token);

    setToken(response.token);

    const loggedUser = await UserService.me();

    setUser(loggedUser);
  }

  function logout() {
    tokenStorage.remove();

    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}