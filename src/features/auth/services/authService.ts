import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { RegisterAlunoData, RegisterPixResponse } from "../types/types";

import type {
    LoginRequest,
    LoginResponse,
} from "../types/auth";

class AuthService {

    async login(data: LoginRequest) {

        const response =
            await api.post<LoginResponse>(
                `${ENDPOINTS.AUTH}/login`,
                data
            );

        return response.data;

    }

    async register(data: RegisterAlunoData): Promise<RegisterPixResponse> {
    const response = await api.post<RegisterPixResponse>("/auth/register", data);
    return response.data;
    }

}

export default new AuthService();