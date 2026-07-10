import { z } from "zod";

export const alunoSchema = z.object({

    nome: z
        .string()
        .min(3, "Informe o nome."),

    email: z
        .email("E-mail inválido."),

    telefone: z
        .string()
        .min(10, "Telefone inválido."),

    dataNascimento: z
        .string()
        .min(1, "Informe a data."),

    sexo: z
        .string()
        .min(1, "Informe o sexo.")

});

export type AlunoSchema =
    z.infer<typeof alunoSchema>;