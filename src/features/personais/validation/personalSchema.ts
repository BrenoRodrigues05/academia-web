import { z } from "zod";

export const personalSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(3, "O nome deve possuir pelo menos 3 caracteres."),

    sobrenome: z
        .string()
        .trim()
        .min(2, "O sobrenome deve possuir pelo menos 2 caracteres."),

    email: z
        .string()
        .trim()
        .email("Informe um e-mail válido."),

    telefone: z
        .string()
        .trim()
        .min(10, "Telefone inválido."),

    cref: z
        .string()
        .trim()
        .min(6, "O CREF deve possuir pelo menos 6 caracteres."),

    especialidade: z
        .string()
        .trim()
        .min(3, "Informe uma especialidade válida."),

    sexo: z
        .string()
        .min(1, "Selecione o sexo.")
});

export type PersonalSchema = z.infer<typeof personalSchema>;