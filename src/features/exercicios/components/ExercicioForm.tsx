import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { GrupoMuscular } from "@/shared/enums/GrupoMuscular";
import { GrupoMuscularLabel } from "@/shared/enums/GrupoMuscularLabel";

import {
    exercicioSchema,
    type ExercicioFormData,
} from "../validation/exercicioSchema";

import type { Exercicio } from "../types";

type Props = {
    exercicio?: Exercicio | null;
    onSubmit: (data: ExercicioFormData) => Promise<void>;
};

export default function ExercicioForm({
    exercicio,
    onSubmit,
}: Props) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
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
        <form onSubmit={handleSubmit(onSubmit)}>

            <Grid container spacing={2}>

                <Grid size={12}>
                    <TextField
                        label="Nome"
                        fullWidth
                        {...register("nome")}
                        error={!!errors.nome}
                        helperText={errors.nome?.message}
                    />
                </Grid>

                <Grid size={12}>
                    <TextField
                        select
                        label="Grupo Muscular"
                        fullWidth
                        defaultValue=""
                        {...register("grupoMuscular")}
                        error={!!errors.grupoMuscular}
                        helperText={errors.grupoMuscular?.message}
                    >
                        <MenuItem value="" disabled>
                            Selecione um grupo muscular
                        </MenuItem>

                        {Object.values(GrupoMuscular).map((grupo) => (
                            <MenuItem
                                key={grupo}
                                value={grupo}
                            >
                                {GrupoMuscularLabel[grupo]}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid size={12}>
                    <TextField
                        label="Descrição"
                        fullWidth
                        multiline
                        rows={4}
                        {...register("descricao")}
                        error={!!errors.descricao}
                        helperText={errors.descricao?.message}
                    />
                </Grid>

                <Grid size={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        loading={isSubmitting}
                    >
                        {exercicio
                            ? "Atualizar Exercício"
                            : "Cadastrar Exercício"}
                    </Button>
                </Grid>

            </Grid>

        </form>
    );
}