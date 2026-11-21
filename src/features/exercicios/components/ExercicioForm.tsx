import { Grid, InputAdornment } from "@mui/material";
import { FitnessCenterOutlined } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { GrupoMuscular } from "@/shared/enums/GrupoMuscular";
import { GrupoMuscularLabel } from "@/shared/enums/GrupoMuscularLabel";

import {
    AppTextField,
    AppSelectField,
    AppTextArea,
    } from "@/components/forms";

    import {
    exercicioSchema,
    type ExercicioFormData,
    } from "../validation/exercicioSchema";

    import type { Exercicio } from "../types";

    type Props = {
    exercicio?: Exercicio | null;
    onSubmit: (data: ExercicioFormData) => Promise<void>;
    };

    const grupoOptions = Object.values(GrupoMuscular).map((grupo) => ({
    value: grupo,
    label: GrupoMuscularLabel[grupo],
    }));

    export default function ExercicioForm({ exercicio, onSubmit }: Props) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ExercicioFormData>({
        resolver: zodResolver(exercicioSchema),
        defaultValues: {
        nome: "",
        grupoMuscular: undefined,
        descricao: "",
        },
    });

    useEffect(() => {
        if (exercicio) {
        reset({
            nome: exercicio.nome,
            grupoMuscular: exercicio.grupoMuscular,
            descricao: exercicio.descricao,
        });
        } else {
        reset({
            nome: "",
            grupoMuscular: undefined,
            descricao: "",
        });
        }
    }, [exercicio, reset]);

    return (
        <form id="crud-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.5}>
            <Grid size={12}>
            <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="Nome"
                    autoComplete="off"
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                    slotProps={{
                    input: {
                        startAdornment: (
                        <InputAdornment position="start">
                            <FitnessCenterOutlined
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
                name="grupoMuscular"
                control={control}
                render={({ field }) => (
                <AppSelectField
                    {...field}
                    value={field.value ?? ""}
                    label="Grupo muscular"
                    options={grupoOptions}
                    error={!!errors.grupoMuscular}
                    helperText={errors.grupoMuscular?.message}
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
                    minRows={4}
                    error={!!errors.descricao}
                    helperText={errors.descricao?.message}
                />
                )}
            />
            </Grid>
        </Grid>
        </form>
    );
}