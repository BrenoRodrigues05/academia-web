import { useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
import { AppPagination, AppLoading } from "@/components/ui";
import AppSnackbar from "@/components/feedback/AppSnackbar";

import useExercicios from "../hooks/useExercicios";
import ExercicioDialog from "../components/ExercicioDialog";
import ExercicioTable from "../components/ExercicioTable";

import type { Exercicio } from "../types";
import type { ExercicioFormData } from "../validation/exercicioSchema";

export default function ExerciciosPage() {
    const {
        data,
        loading,
        page,
        setPage,
        reload,
        create,
        update,
        remove,
        notification,
        closeNotification,
    } = useExercicios();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedExercicio, setSelectedExercicio] = useState<Exercicio | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [exercicioTarget, setExercicioTarget] = useState<Exercicio | null>(null);

    // Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [grupoMuscularFilter, setGrupoMuscularFilter] = useState<string>("todos");

    function handleNovo() {
        setSelectedExercicio(null);
        setDialogOpen(true);
    }

    function handleEditar(exercicio: Exercicio) {
        setSelectedExercicio(exercicio);
        setDialogOpen(true);
    }

    function handleFechar() {
        if (!submitting) {
            setDialogOpen(false);
            setSelectedExercicio(null);
        }
    }

    async function handleSalvar(dataForm: ExercicioFormData) {
        setSubmitting(true);
        try {
            if (selectedExercicio) {
                await update(selectedExercicio.id, dataForm);
            } else {
                await create(dataForm);
            }
            handleFechar();
        } catch (error) {
            console.error("Erro ao salvar exercício:", error);
        } finally {
            setSubmitting(false);
        }
    }

    function handleSolicitarExclusao(exercicio: Exercicio) {
        setExercicioTarget(exercicio);
        setDeleteDialogOpen(true);
    }

    async function confirmExcluir() {
        if (!exercicioTarget) return;
        try {
            await remove(exercicioTarget.id);
        } catch (error) {
            console.error("Erro ao excluir exercício:", error);
        } finally {
            setDeleteDialogOpen(false);
            setExercicioTarget(null);
        }
    }

    // Tratamento defensivo da lista
    const rawList: Exercicio[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

    const gruposMuscularesDisponiveis = Array.from(
        new Set(rawList.map((item) => item.grupoMuscular).filter(Boolean))
    );

    const filteredExercicios = rawList.filter((exercicio) => {
        const passaNome =
            !searchTerm ||
            exercicio.nome.toLowerCase().includes(searchTerm.toLowerCase());

        const passaGrupo =
            grupoMuscularFilter === "todos" ||
            exercicio.grupoMuscular?.toLowerCase() === grupoMuscularFilter.toLowerCase();

        return passaNome && passaGrupo;
    });

    const renderTableContent = () => {
        if (loading) {
            return <AppLoading />;
        }

        if (!data) {
            return (
                <ErrorState
                    message="Não foi possível carregar os exercícios."
                    onRetry={reload}
                />
            );
        }

        if (filteredExercicios.length === 0) {
            return (
                <EmptyState message="Nenhum exercício encontrado para os filtros selecionados." />
            );
        }

        return (
            <ExercicioTable
                exercicios={filteredExercicios}
                onEdit={handleEditar}
                onDelete={handleSolicitarExclusao}
            />
        );
    };

    return (
        <>
            <LoadingOverlay open={submitting} />

            <CrudPage
                toolbar={
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        <Box sx={{ flexGrow: 1, width: "100%" }}>
                            <CrudToolbar
                                title="Exercícios"
                                subtitle="Gerenciamento da biblioteca de exercícios"
                                createLabel="Novo Exercício"
                                onCreate={handleNovo}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 2,
                                width: "100%",
                                mt: -1,
                                flexWrap: "wrap",
                            }}
                        >
                            <TextField
                                size="small"
                                label="Buscar por nome"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ minWidth: 220, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
                            />

                            <FormControl
                                size="small"
                                sx={{ minWidth: 200, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
                            >
                                <InputLabel id="grupo-muscular-filter-label">
                                    Grupo Muscular
                                </InputLabel>
                                <Select
                                    labelId="grupo-muscular-filter-label"
                                    value={grupoMuscularFilter}
                                    label="Grupo Muscular"
                                    onChange={(e) => setGrupoMuscularFilter(e.target.value)}
                                >
                                    <MenuItem value="todos">Todos os grupos</MenuItem>
                                    {gruposMuscularesDisponiveis.map((grupo) => (
                                        <MenuItem key={grupo} value={grupo}>
                                            {grupo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                }
                table={renderTableContent()}
                pagination={
                    !loading &&
                    data &&
                    filteredExercicios.length > 0 &&
                    "totalPages" in data ? (
                        <AppPagination
                            page={page}
                            totalPages={data.totalPages}
                            totalElements={data.totalElements}
                            onChange={setPage}
                        />
                    ) : undefined
                }
                dialogs={
                    <ExercicioDialog
                        open={dialogOpen}
                        exercicio={selectedExercicio}
                        onClose={handleFechar}
                        onSubmit={handleSalvar}
                    />
                }
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                severity="error"
                title="Excluir Exercício"
                message={`Deseja realmente excluir o exercício "${exercicioTarget?.nome}"?`}
                confirmText="Excluir"
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={confirmExcluir}
            />

            <AppSnackbar
            open={notification.open}
            message={notification.message}
            severity={notification.severity}
            onClose={closeNotification}
            />
        </>
    );
}