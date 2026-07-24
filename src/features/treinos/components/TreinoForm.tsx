import { useEffect, useMemo, useState } from "react";

import {
    Box,
    Button,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    treinoSchema,
    type TreinoFormData,
    type ItemTreinoFormData,
} from "../validation/treinoSchema";

import type { Treino } from "../types";
import type { Aluno } from "@/features/alunos/types";
import type { Exercicio } from "@/features/exercicios/types";

import ItemTreinoDialog from "./ItemTreinoDialog";
import ItemTreinoTable, {
    type ItemTreinoTableData,
} from "./ItemTreinoTable";

type Props = {
    alunos: Aluno[];
    exercicios: Exercicio[];
    currentPersonalId: number; 
    initialData?: Treino;
    onSubmit: (data: TreinoFormData) => Promise<void>;
};

export default function TreinoForm({
    alunos,
    exercicios,
    currentPersonalId,
    initialData,
    onSubmit,
}: Props) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TreinoFormData>({
        resolver: zodResolver(treinoSchema),
        defaultValues: {
            nome: "",
            observacoes: "",
            alunoId: 0,
            personalId: currentPersonalId, 
            dataInicio: "",
            dataFim: "",
            itens: [],
        },
    });

    const [itens, setItens] = useState<ItemTreinoTableData[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!initialData) return;

        const listaFormatada = initialData.itens.map((item) => ({
            exercicioId: item.exercicio.id,
            exercicio: item.exercicio,
            series: item.series,
            repeticoes: item.repeticoes,
            descansoSegundos: item.descansoSegundos,
        }));

        setItens(listaFormatada);

        reset({
            nome: initialData.nome,
            observacoes: initialData.observacoes ?? "",
            alunoId: initialData.aluno.id,
            personalId: initialData.personal?.id ?? currentPersonalId,
            dataInicio: initialData.dataInicio,
            dataFim: initialData.dataFim ?? "",
            itens: listaFormatada,
        });
    }, [initialData, reset, currentPersonalId]);

    useEffect(() => {
        setValue(
            "itens",
            itens.map((item) => ({
                exercicioId: item.exercicioId,
                series: item.series,
                repeticoes: item.repeticoes,
                descansoSegundos: item.descansoSegundos,
            }))
        );
    }, [itens, setValue]);

    const editingItem = useMemo(() => {
        if (editingIndex === null) return undefined;
        return itens[editingIndex];
    }, [editingIndex, itens]);

    function handleNovoItem() {
        setEditingIndex(null);
        setDialogOpen(true);
    }

    function handleEditarItem(index: number) {
        setEditingIndex(index);
        setDialogOpen(true);
    }

    function handleExcluirItem(index: number) {
        setItens(itens.filter((_, i) => i !== index));
    }

    function handleSalvarItem(data: ItemTreinoFormData) {
        const exercicio = exercicios.find((e) => e.id === data.exercicioId);
        if (!exercicio) return;

        const item: ItemTreinoTableData = {
            ...data,
            exercicio,
        };

        const exercicioJaExiste = itens.some(
            (item, index) =>
                item.exercicioId === data.exercicioId &&
                index !== editingIndex
        );

        if (exercicioJaExiste) {
            alert("Este exercício já foi adicionado ao treino.");
            return;
        }

        if (editingIndex !== null) {
            const copia = [...itens];
            copia[editingIndex] = item;
            setItens(copia);
        } else {
            setItens([...itens, item]);
        }

        setDialogOpen(false);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Nome do treino"
                            {...register("nome")}
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                        />
                    </Grid>
                    <Grid size={12}> 
                        <Controller
                            control={control}
                            name="alunoId"
                            render={({ field }) => (
                                <TextField
                                    select
                                    fullWidth
                                    label="Aluno"
                                    {...field}
                                    error={!!errors.alunoId}
                                    helperText={errors.alunoId?.message}
                                >
                                    {alunos.map((aluno) => (
                                        <MenuItem
                                            key={aluno.id}
                                            value={aluno.id}
                                        >
                                            {aluno.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Data início"
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            {...register("dataInicio")}
                            error={!!errors.dataInicio}
                            helperText={errors.dataInicio?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Data fim"
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            {...register("dataFim")}
                            error={!!errors.dataFim}
                            helperText={errors.dataFim?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label="Observações"
                            {...register("observacoes")}
                            error={!!errors.observacoes}
                            helperText={errors.observacoes?.message}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Exercícios
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleNovoItem}
                    >
                        Adicionar Exercício
                    </Button>
                </Stack>

                <ItemTreinoTable
                    itens={itens}
                    onEdit={handleEditarItem}
                    onDelete={handleExcluirItem}
                />

                {errors.itens && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {errors.itens.message}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 4,
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={isSubmitting}
                    >
                        Salvar Treino
                    </Button>
                </Box>
            </form>

            <ItemTreinoDialog
                open={dialogOpen}
                exercicios={exercicios}
                initialData={editingItem}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingIndex(null);
                }}
                onSubmit={handleSalvarItem}
            />
        </>
    );
}