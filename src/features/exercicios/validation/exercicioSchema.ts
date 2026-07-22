import { z } from "zod";

export const exercicioSchema = z.object({

    nome: z
        .string()
        .trim()
        .min(3, "O nome deve possuir no mínimo 3 caracteres.")
        .max(100, "O nome deve possuir no máximo 100 caracteres."),

    grupoMuscular: z
        .string()
        .trim()
        .min(3, "Informe o grupo muscular.")
        .max(50, "O grupo muscular deve possuir no máximo 50 caracteres."),

    descricao: z
        .string()
        .trim()
        .min(5, "A descrição deve possuir no mínimo 5 caracteres.")
        .max(255, "A descrição deve possuir no máximo 255 caracteres.")

});

export type ExercicioFormData = z.infer<typeof exercicioSchema>;