import { UserRole } from "@/shared/enums/UserRole";

export interface User {
    id: number;
    login: string;
    role: UserRole;
    ativo: boolean;
    personalId?: number;
}