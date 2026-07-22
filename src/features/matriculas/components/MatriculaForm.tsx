import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Alert,
    Autocomplete,
    Button,
    Stack,
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
    // Se a matrícula for enviada e estiver inativa, consideramos desabilitada
    const isMatriculaInativa = defaultValues?.ativa === false;

    const { control, handleSubmit } = useForm<MatriculaFormData>({
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
            {isMatriculaInativa && (
            <Alert severity="warning">
                Para editar a matrícula, ative-a novamente na listagem.
            </Alert>
            )}

            <Controller
            name="alunoId"
            control={control}
            render={({ field, fieldState }) => (
                <Autocomplete
                disabled={isMatriculaInativa || loading}
                options={alunos}
                getOptionLabel={(option) => option.nome}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                    alunos.find((aluno) => aluno.id === field.value) ?? null
                }
                onChange={(_, value) => field.onChange(value?.id ?? 0)}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Aluno"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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
                disabled={isMatriculaInativa || loading}
                options={planos}
                getOptionLabel={(option) => option.nome}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                    planos.find((plano) => plano.id === field.value) ?? null
                }
                onChange={(_, value) => field.onChange(value?.id ?? 0)}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Plano"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    />
                )}
                />
            )}
            />

            <Button
            type="submit"
            variant="contained"
            disabled={isMatriculaInativa || loading}
            >
            Salvar
            </Button>
        </Stack>
        </form>
    );
}