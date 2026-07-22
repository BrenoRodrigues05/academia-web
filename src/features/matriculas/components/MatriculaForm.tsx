import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Autocomplete,
    Button,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from "@mui/material";

import { matriculaSchema } from "../validation/matriculasSchema";
import type { MatriculaFormData } from "../validation/matriculasSchema";

import type { MatriculaCreate } from "../types";

import type { Aluno } from "@/features/alunos/types";
import type { Plano } from "@/features/planos/types";

interface MatriculaFormProps {
    defaultValues?: Partial<MatriculaCreate>;
    alunos: Aluno[];
    planos: Plano[];
    loading?: boolean;
    onSubmit: (data: MatriculaFormData) => void | Promise<void>;
}

export default function MatriculaForm({
    defaultValues,
    alunos,
    planos,
    loading = false,
    onSubmit,
}: MatriculaFormProps) {

    const {
        control,
        handleSubmit,
    } = useForm<MatriculaFormData>({
        resolver: zodResolver(matriculaSchema),

        defaultValues: {
            alunoId: defaultValues?.alunoId ?? 0,
            planoId: defaultValues?.planoId ?? 0,
            ativa: defaultValues?.ativa ?? true,
        },
    });

    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <Stack spacing={3}>

                <Controller
                    name="alunoId"
                    control={control}
                    render={({ field, fieldState }) => (

                        <Autocomplete
                            options={alunos}

                            getOptionLabel={(option) =>
                                option.nome
                            }

                            isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                            }

                            value={
                                alunos.find(
                                    (aluno) =>
                                        aluno.id === field.value
                                ) ?? null
                            }

                            onChange={(_, value) =>
                                field.onChange(
                                    value?.id ?? 0
                                )
                            }

                            renderInput={(params) => (

                                <TextField
                                    {...params}

                                    label="Aluno"

                                    error={!!fieldState.error}

                                    helperText={
                                        fieldState.error?.message
                                    }
                                />

                            )}
                        />

                    )}
                />

                <Controller
                    name="planoId"
                    control={control}
                    render={({ field, fieldState }) => (

                        <Autocomplete
                            options={planos}

                            getOptionLabel={(option) =>
                                option.nome
                            }

                            isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                            }

                            value={
                                planos.find(
                                    (plano) =>
                                        plano.id === field.value
                                ) ?? null
                            }

                            onChange={(_, value) =>
                                field.onChange(
                                    value?.id ?? 0
                                )
                            }

                            renderInput={(params) => (

                                <TextField
                                    {...params}

                                    label="Plano"

                                    error={!!fieldState.error}

                                    helperText={
                                        fieldState.error?.message
                                    }
                                />

                            )}
                        />

                    )}
                />
                <Controller
                    name="ativa"
                    control={control}
                    render={({ field }) => (

                        <FormControlLabel
                            label="Matrícula ativa"

                            control={

                                <Switch
                                    checked={field.value}

                                    onChange={(_, checked) =>
                                        field.onChange(checked)
                                    }

                                />

                            }

                        />

                    )}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    Salvar
                </Button>

            </Stack>

        </form>
    );
}