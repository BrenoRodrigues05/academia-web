import { z } from "zod";
import { TipoPlano } from "@/shared/enums/TipoPlano";

export const planoSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(3, "O nome é obrigatório e deve ter ao menos 3 caracteres.")
        .max(100, "O nome deve ter no máximo 100 caracteres."),
    descricao: z
        .string()
        .trim()
        .min(10, "A descrição é obrigatória e deve ter ao menos 10 caracteres.")
        .max(500, "A descrição deve ter no máximo 500 caracteres."),
    valor: z
        .coerce
        .number({ message: "Informe um valor válido." })
        .positive("O valor deve ser maior que zero.") as unknown as z.ZodNumber,

    tipo: z.nativeEnum(TipoPlano, {
        message: "Selecione um tipo de plano válido.",
    }),
    
    imagemUrl: z.string().trim().url("Informe uma URL válida.").optional().or(z.literal(""))
});

export type PlanoSchema = z.infer<typeof planoSchema>;