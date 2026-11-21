import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Box, Grid, InputAdornment } from "@mui/material";
import { Inventory2Outlined } from "@mui/icons-material";

import { AppTextField, AppTextArea } from "@/components/forms";
import { produtoSchema } from "../validation/produtoSchema";
import type { Produto } from "../types";
import type { ProdutoFormData } from "../validation/produtoSchema";

type Props = {
    initialData?: Produto;
    onSubmit: (data: ProdutoFormData) => Promise<void>;
    };

    const emptyValues: ProdutoFormData = {
    nome: "",
    descricao: "",
    preco: 0,
    estoque: 0,
    imagemUrl: "",
    };

    export default function ProdutoForm({ initialData, onSubmit }: Props) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProdutoFormData>({
        resolver: zodResolver(produtoSchema) as any,
        defaultValues: emptyValues,
    });

    const imagemUrl = useWatch({ control, name: "imagemUrl" });

    useEffect(() => {
        if (initialData) {
        reset({
            nome: initialData.nome,
            descricao: initialData.descricao || "",
            preco: Number(initialData.preco),
            estoque: Number(initialData.estoque),
            imagemUrl: initialData.imagemUrl || "",
        });
        } else {
        reset(emptyValues);
        }
    }, [initialData, reset]);

    return (
        <form id="crud-form" onSubmit={handleSubmit(onSubmit as any)} noValidate>
        <Grid container spacing={2.5}>
            <Grid size={12}>
            <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="Nome do produto"
                    autoComplete="off"
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                    slotProps={{
                    input: {
                        startAdornment: (
                        <InputAdornment position="start">
                            <Inventory2Outlined
                            sx={{ color: "text.secondary", fontSize: 20 }}
                            />
                        </InputAdornment>
                        ),
                    },
                    }}
                />
                )}
            />
            </Grid>

            <Grid size={12}>
            <Controller
                name="descricao"
                control={control}
                render={({ field }) => (
                <AppTextArea
                    {...field}
                    value={field.value ?? ""}
                    label="Descrição"
                    minRows={3}
                    error={!!errors.descricao}
                    helperText={errors.descricao?.message}
                />
                )}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
                name="preco"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="Preço"
                    type="number"
                    error={!!errors.preco}
                    helperText={errors.preco?.message}
                    slotProps={{
                    input: {
                        startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                        ),
                    },
                    htmlInput: { step: "0.01", min: 0 },
                    }}
                />
                )}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
                name="estoque"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="Estoque"
                    type="number"
                    error={!!errors.estoque}
                    helperText={errors.estoque?.message}
                    slotProps={{
                    input: {
                        endAdornment: (
                        <InputAdornment position="end">un.</InputAdornment>
                        ),
                    },
                    htmlInput: { min: 0 },
                    }}
                />
                )}
            />
            </Grid>

            <Grid size={12}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Controller
                name="imagemUrl"
                control={control}
                render={({ field }) => (
                    <AppTextField
                    {...field}
                    value={field.value ?? ""}
                    label="URL da imagem"
                    autoComplete="off"
                    error={!!errors.imagemUrl}
                    helperText={errors.imagemUrl?.message}
                    />
                )}
                />

                <Avatar
                src={imagemUrl || undefined}
                variant="rounded"
                sx={{
                    width: 40,
                    height: 40,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "action.hover",
                }}
                >
                <Inventory2Outlined fontSize="small" />
                </Avatar>
            </Box>
            </Grid>
        </Grid>
        </form>
    );
}