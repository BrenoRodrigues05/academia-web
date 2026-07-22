import { Button, Grid, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
            grupoMuscular: "",
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

                grupoMuscular: "",

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
                        label="Grupo Muscular"
                        fullWidth
                        {...register("grupoMuscular")}
                        error={!!errors.grupoMuscular}
                        helperText={errors.grupoMuscular?.message}
                    />

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