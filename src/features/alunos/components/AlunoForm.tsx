import {
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { alunoSchema } from "../validation/alunoSchema";

import { Sexo } from "../../../shared/enums/Sexo";

import type { AlunoSchema } from "../validation/alunoSchema";

type Props = {

    defaultValues?: Partial<AlunoSchema>;

    onSubmit: (data: AlunoSchema) => void;

};

export default function AlunoForm({

    defaultValues,

    onSubmit,

}: Props) {

    const {

        control,

        handleSubmit,

        formState: { errors },

    } = useForm<AlunoSchema>({

        resolver: zodResolver(alunoSchema),

        defaultValues,

    });

    return (

        <form

            id="crud-form"

            onSubmit={handleSubmit(onSubmit)}

            >

            <Grid container spacing={2}>

                <Grid size={{ xs: 12 }}>

                    <Controller

                        name="nome"

                        control={control}

                        render={({ field }) => (

                            <TextField

                                {...field}

                                fullWidth

                                label="Nome"

                                error={!!errors.nome}

                                helperText={errors.nome?.message}

                            />

                        )}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <Controller

                        name="email"

                        control={control}

                        render={({ field }) => (

                            <TextField

                                {...field}

                                fullWidth

                                label="E-mail"

                                error={!!errors.email}

                                helperText={errors.email?.message}

                            />

                        )}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <Controller

                        name="telefone"

                        control={control}

                        render={({ field }) => (

                            <TextField

                                {...field}

                                fullWidth

                                label="Telefone"

                                error={!!errors.telefone}

                                helperText={errors.telefone?.message}

                            />

                        )}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <Controller

                        name="dataNascimento"

                        control={control}

                        render={({ field }) => (

                            <TextField

                                {...field}

                                fullWidth

                                type="date"

                                label="Data de nascimento"

                                slotProps={{
                                  inputLabel: {
                                    shrink: true,
                                  },
                                }}

                                error={!!errors.dataNascimento}

                                helperText={
                                    errors.dataNascimento?.message
                                }

                            />

                        )}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <Controller

                        name="sexo"

                        control={control}

                        render={({ field }) => (

                            <TextField

                                {...field}

                                fullWidth

                                select

                                label="Sexo"

                                error={!!errors.sexo}

                                helperText={errors.sexo?.message}

                            >

                                <MenuItem value={Sexo.MASCULINO}>
                                    Masculino
                                </MenuItem>

                                <MenuItem value={Sexo.FEMININO}>
                                    Feminino
                                </MenuItem>

                            </TextField>

                        )}

                    />

                </Grid>

            </Grid>

        </form>

    );

}