import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { produtoSchema } from "../validation/produtoSchema";
import type { Produto } from "../types";
import type { ProdutoFormData } from "../validation/produtoSchema"; 
import { useEffect } from "react";

type Props = {
    initialData?: Produto;
    onSubmit: (data: ProdutoFormData) => Promise<void>;
};

export default function ProdutoForm({ initialData, onSubmit }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProdutoFormData>({
        resolver: zodResolver(produtoSchema) as any, 
        defaultValues: {
            nome: "",
            descricao: "",
            preco: 0,
            estoque: 0,
            imagemUrl: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                nome: initialData.nome,
                descricao: initialData.descricao || "",
                preco: Number(initialData.preco),
                estoque: Number(initialData.estoque),
                imagemUrl: initialData.imagemUrl || "",
            });
        }
    }, [initialData, reset]);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit as any)}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
            <TextField
                label="Nome do Produto"
                fullWidth
                size="small"
                {...register("nome")}
                error={!!errors.nome}
                helperText={errors.nome?.message}
            />

            <TextField
                label="Descrição"
                fullWidth
                multiline
                rows={3}
                size="small"
                {...register("descricao")}
                error={!!errors.descricao}
                helperText={errors.descricao?.message}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                    label="Preço (R$)"
                    type="number"
                    fullWidth
                    size="small"
                    error={!!errors.preco}
                    helperText={errors.preco?.message}
                    {...register("preco")}
                    // @ts-ignore
                    inputProps={{ step: "0.01" }}
                />

                <TextField
                    label="Estoque Inicial"
                    type="number"
                    fullWidth
                    size="small"
                    error={!!errors.estoque}
                    helperText={errors.estoque?.message}
                    {...register("estoque")}
                />
            </Box>

            <TextField
                label="URL da Imagem"
                fullWidth
                size="small"
                {...register("imagemUrl")}
                error={!!errors.imagemUrl}
                helperText={errors.imagemUrl?.message}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
            </Box>
        </Box>
    );
}