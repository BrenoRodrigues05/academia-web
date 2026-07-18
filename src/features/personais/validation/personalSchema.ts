import { z } from "zod";

export const personalSchema = z.object({
    nome: z.string().trim().min(3, "O nome é obrigatório e deve ter ao menos 3 caracteres."),
    sobrenome: z.string().trim().min(2, "O sobrenome é obrigatório."),
    email: z.string().trim().email("Informe um e-mail válido."),
    telefone: z.string().trim().min(10, "Telefone inválido."),
    cref: z.string().trim().min(6, "O CREF é obrigatório."),
    especialidade: z.string().trim().optional(), 
    sexo: z.string().min(1, "O sexo é obrigatório.") 
});

export type PersonalSchema = z.infer<typeof personalSchema>;