import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";

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

    const formatMoney = (valor: number | string) =>
    Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const popupPaperSx = {
    mt: 0.5,
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
    };

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
        <form id="crud-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
            {isMatriculaInativa && (
            <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
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
                value={alunos.find((aluno) => aluno.id === field.value) ?? null}
                onChange={(_, value) => field.onChange(value?.id ?? 0)}
                noOptionsText="Nenhum aluno disponível"
                slotProps={{ paper: { sx: popupPaperSx } }}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    size="small"
                    label="Aluno"
                    error={!!fieldState.error}
                    helperText={
                        fieldState.error?.message ??
                        (isEditMode ? "O aluno não pode ser alterado." : undefined)
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
                disabled={isMatriculaInativa || loading}
                options={planos}
                getOptionLabel={(option) =>
                    `${option.nome} — ${formatMoney(option.valor)}`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={planos.find((plano) => plano.id === field.value) ?? null}
                onChange={(_, value) => field.onChange(value?.id ?? 0)}
                noOptionsText="Nenhum plano encontrado"
                slotProps={{ paper: { sx: popupPaperSx } }}
                renderOption={(props, option) => {
                    const { key, ...rest } = props;
                    return (
                    <Box
                        component="li"
                        key={key}
                        {...rest}
                        sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
                    >
                        <span>{option.nome}</span>
                        <Typography
                        component="span"
                        sx={{ fontWeight: 800, color: "primary.main" }}
                        >
                        {formatMoney(option.valor)}
                        </Typography>
                    </Box>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    size="small"
                    label="Plano"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    />
                )}
                />
            )}
            />
        </Stack>
        </form>
    );
}