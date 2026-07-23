import {
    Button,
    Grid,
    MenuItem,
    TextField,
} from "@mui/material";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    Controller,
    useForm,
} from "react-hook-form";

import { useEffect } from "react";

import {
    itemTreinoSchema,
    type ItemTreinoFormData,
} from "../validation/treinoSchema";

import type { Exercicio } from "@/features/exercicios/types";

type Props = {

    exercicios: Exercicio[];

    initialData?: ItemTreinoFormData;

    onSubmit: (
        data: ItemTreinoFormData
    ) => void;

};

export default function ItemTreinoForm({

    exercicios,

    initialData,

    onSubmit,

}: Props) {

    const {

        control,

        register,

        handleSubmit,

        reset,

        formState: {

            errors,

            isSubmitting,

        },

    } = useForm<ItemTreinoFormData>({

        resolver:
            zodResolver(itemTreinoSchema),

        defaultValues: {

            exercicioId: 0,

            series: 3,

            repeticoes: 12,

            descansoSegundos: 60,

        },

    });

    useEffect(() => {

        if (initialData) {

            reset(initialData);

        }

    }, [initialData, reset]);

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
        >

            <Grid container spacing={2}>

                <Grid size={12}>

                    <Controller

                        control={control}

                        name="exercicioId"

                        render={({ field }) => (

                            <TextField

                                select

                                fullWidth

                                label="Exercício"

                                {...field}

                                error={
                                    !!errors.exercicioId
                                }

                                helperText={
                                    errors.exercicioId?.message
                                }

                            >

                                {exercicios.map(

                                    (exercicio) => (

                                        <MenuItem

                                            key={
                                                exercicio.id
                                            }

                                            value={
                                                exercicio.id
                                            }

                                        >

                                            {
                                                exercicio.nome
                                            }

                                        </MenuItem>

                                    )

                                )}

                            </TextField>

                        )}

                    />

                </Grid>

                <Grid size={4}>

                    <TextField

                        label="Séries"

                        type="number"

                        fullWidth

                        {...register("series", {

                            valueAsNumber: true,

                        })}

                        error={
                            !!errors.series
                        }

                        helperText={
                            errors.series?.message
                        }

                    />

                </Grid>

                <Grid size={4}>

                    <TextField

                        label="Repetições"

                        type="number"

                        fullWidth

                        {...register(
                            "repeticoes",
                            {
                                valueAsNumber: true,
                            }
                        )}

                        error={
                            !!errors.repeticoes
                        }

                        helperText={
                            errors.repeticoes?.message
                        }

                    />

                </Grid>

                <Grid size={4}>

                    <TextField

                        label="Descanso"

                        type="number"

                        fullWidth

                        {...register(
                            "descansoSegundos",
                            {
                                valueAsNumber: true,
                            }
                        )}

                        error={
                            !!errors.descansoSegundos
                        }

                        helperText={
                            errors.descansoSegundos
                                ?.message
                        }

                    />

                </Grid>

                <Grid size={12}>

                    <Button

                        type="submit"

                        fullWidth

                        variant="contained"

                        loading={isSubmitting}

                    >

                        Salvar Exercício

                    </Button>

                </Grid>

            </Grid>

        </form>

    );

}