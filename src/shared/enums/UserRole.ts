export const UserRole = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    ALUNO: "ALUNO",
    PERSONAL: "PERSONAL"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];