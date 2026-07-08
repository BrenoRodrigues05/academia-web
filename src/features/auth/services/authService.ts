import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

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

}

export default new AuthService();