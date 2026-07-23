import { z } from "zod";

export const itemTreinoSchema = z.object({
    exercicioId: z
        .number({ message: "Selecione um exercício." })
        .positive("Selecione um exercício."),

    series: z
        .number({ message: "Informe a quantidade de séries." })
        .min(1, "A quantidade mínima é 1."),

    repeticoes: z
        .number({ message: "Informe a quantidade de repetições." })
        .min(1, "A quantidade mínima é 1."),

    descansoSegundos: z
        .number({ message: "Informe o tempo de descanso." })
        .min(0, "O descanso não pode ser negativo.")
});

export const treinoSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(3, "O nome deve possuir no mínimo 3 caracteres.")
        .max(100, "O nome deve possuir no máximo 100 caracteres."),

    observacoes: z
        .string()
        .trim()
        .max(500, "Máximo de 500 caracteres.")
        .optional()
        .or(z.literal("")),

    alunoId: z
        .number({ message: "Selecione um aluno." })
        .positive("Selecione um aluno."),

    dataInicio: z
        .string({ message: "Informe a data de início." })
        .min(1, "Informe a data de início."),

    dataFim: z
        .string({ message: "Informe a data final." })
        .min(1, "Informe a data final."),

    itens: z
        .array(itemTreinoSchema)
        .min(1, "Adicione pelo menos um exercício.")
}).refine(
    (data) => {
        if (!data.dataInicio || !data.dataFim) return true;
        return new Date(data.dataFim) >= new Date(data.dataInicio);
    },
    {
        path: ["dataFim"],
        message: "A data final deve ser maior ou igual à data inicial."
    }
);

export type TreinoFormData = z.infer<typeof treinoSchema>;
export type ItemTreinoFormData = z.infer<typeof itemTreinoSchema>;