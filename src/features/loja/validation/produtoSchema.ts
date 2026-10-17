import { z } from "zod";

export const produtoSchema = z.object({
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    descricao: z.string().optional(),
    preco: z.coerce.number().positive("O preço deve ser maior que zero"),
    estoque: z.coerce.number().int().min(0, "O estoque não pode ser negativo"),
    imagemUrl: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;