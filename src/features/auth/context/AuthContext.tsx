import { createContext } from "react";

interface AuthContextData {

    token: string | null;

    login: () => void;

    logout: () => void;

}

export const AuthContext =
    createContext<AuthContextData>(
        {} as AuthContextData
    );