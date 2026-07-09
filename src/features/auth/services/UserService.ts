import api from "@/api/axios";
import type { User } from "../types/User";
    
class UserService {

    async me(): Promise<User> {

        const response = await api.get<User>("/auth/me");

        return response.data;

    }

}

export default new UserService();