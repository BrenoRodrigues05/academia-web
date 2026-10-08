import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Autocomplete, Button, Stack, TextField } from "@mui/material";

import { matriculaSchema } from "../validation/matriculasSchema";
import type { MatriculaFormData } from "../validation/matriculasSchema";
import type { MatriculaCreate, Matricula } from "../types";
import type { Aluno } from "@/features/alunos/types";
import type { Plano } from "@/features/planos/types";

interface MatriculaFormProps {
    defaultValues?: Partial<MatriculaCreate>;
    alunos: Aluno[];
    planos: Plano[];
    matriculas?: Matricula[];
    loading?: boolean;
    isEditMode?: boolean;
    onSubmit: (data: MatriculaFormData) => void | Promise<void>;
    }

    export default function MatriculaForm({
    defaultValues,
    alunos,
    planos,
    matriculas = [],
    loading = false,
    isEditMode = false,
    onSubmit,
    }: MatriculaFormProps) {
    const isMatriculaInativa = isEditMode && defaultValues?.ativa === false;
    const idAlunoEmEdicao = defaultValues?.alunoId ?? 0;

    const { control, handleSubmit } = useForm<MatriculaFormData>({
        resolver: zodResolver(matriculaSchema),
        defaultValues: {
        alunoId: defaultValues?.alunoId ?? 0,
        planoId: defaultValues?.planoId ?? 0,
        ativa: defaultValues?.ativa ?? false,
        },
    });

    const alunosDisponiveis = alunos.filter((aluno) => {
        if (idAlunoEmEdicao > 0 && aluno.id === idAlunoEmEdicao) {
        return true;
        }

        const jaPossuiMatricula = matriculas.some(
        (m) => m.aluno?.id === aluno.id && m.ativa
        );

        return !jaPossuiMatricula;
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
                disabled={isMatriculaInativa || loading || isEditMode}
                options={alunosDisponiveis}
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
                getOptionLabel={(option) => `${option.nome} - R$ ${option.valor}`}
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
            size="large"
            disabled={isMatriculaInativa || loading}
            >
            {isEditMode ? "Salvar Alterações" : "Gerar Pagamento Pix 💳"}
            </Button>
        </Stack>
        </form>
    );
}