import { z } from "zod";

export const registerSchema = z.object({
    login: z.string().min(3, "O login deve ter pelo menos 3 caracteres"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    nome: z.string().min(3, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
    telefone: z.string().min(8, "Informe um telefone válido"),
    sexo: z.string().min(1, "Selecione o sexo"),
    planoId: z.number().min(1, "Selecione um plano"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;