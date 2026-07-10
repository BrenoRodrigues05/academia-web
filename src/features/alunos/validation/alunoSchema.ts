import { z } from "zod";

export const alunoSchema = z.object({

    nome: z
        .string()
        .trim()
        .min(3, "O nome deve possuir pelo menos 3 caracteres."),

    email: z
        .string()
        .trim()
        .email("Informe um e-mail válido."),

    telefone: z
        .string()
        .trim()
        .min(10, "Telefone inválido."),

    dataNascimento: z
        .string()
        .min(1, "Informe a data de nascimento."),

    sexo: z
        .string()
        .min(1, "Selecione o sexo.")

});

export type AlunoSchema =
    z.infer<typeof alunoSchema>;