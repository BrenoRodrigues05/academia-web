import { z } from "zod";

export const matriculaSchema = z.object({
    alunoId: z
        .number({ message: "Selecione um aluno." })
        .positive("Aluno inválido."),

    planoId: z
        .number({ message: "Selecione um plano." })
        .positive("Plano inválido."),

    ativa: z.boolean(),
});

export type MatriculaFormData = z.infer<typeof matriculaSchema>;