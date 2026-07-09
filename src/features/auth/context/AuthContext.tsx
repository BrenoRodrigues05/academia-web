import { createContext } from "react";

import type {
  LoginRequest,
} from "../types/auth";
import type { User } from "../types/User";

interface AuthContextData {
  token: string | null;
  user: User | null;

  login(
    data: LoginRequest
  ): Promise<void>;

  logout(): void;
}

export const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData
  );