import { createContext } from "react";

import type {
  LoginRequest,
} from "../types/auth";

interface AuthContextData {
  token: string | null;

  login(
    data: LoginRequest
  ): Promise<void>;

  logout(): void;
}

export const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData
  );