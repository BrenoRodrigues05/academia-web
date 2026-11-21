import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
import { AppPagination, AppLoading, AppSearch } from "@/components/ui";
import { AppSelectField } from "@/components/forms";
import AppSnackbar from "@/components/feedback/AppSnackbar";

import { GrupoMuscular } from "@/shared/enums/GrupoMuscular";
import { GrupoMuscularLabel } from "@/shared/enums/GrupoMuscularLabel";

import useExercicios from "../hooks/useExercicios";
import ExercicioDialog from "../components/ExercicioDialog";
import ExercicioTable from "../components/ExercicioTable";

import type { Exercicio } from "../types";
import type { ExercicioFormData } from "../validation/exercicioSchema";

const grupoOptions = [
    { value: "todos", label: "Todos os grupos" },
    ...Object.values(GrupoMuscular).map((grupo) => ({
        value: grupo,
        label: GrupoMuscularLabel[grupo],
    })),
    ];

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
    const [deleting, setDeleting] = useState(false);
    const [exercicioTarget, setExercicioTarget] = useState<Exercicio | null>(null);

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
        setDeleting(true);
        try {
        await remove(exercicioTarget.id);
        } catch (error) {
        console.error("Erro ao excluir exercício:", error);
        } finally {
        setDeleting(false);
        setDeleteDialogOpen(false);
        setExercicioTarget(null);
        }
    }

    const rawList: Exercicio[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

    const filteredExercicios = rawList.filter((exercicio) => {
        const passaNome =
        !searchTerm ||
        exercicio.nome.toLowerCase().includes(searchTerm.toLowerCase());

        const passaGrupo =
        grupoMuscularFilter === "todos" ||
        exercicio.grupoMuscular === grupoMuscularFilter;

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
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <CrudToolbar
                title="Exercícios"
                subtitle="Gerenciamento da biblioteca de exercícios"
                createLabel="Novo Exercício"
                onCreate={handleNovo}
                />

                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mt: -1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <FilterAlt sx={{ color: "primary.main" }} fontSize="small" />
                    <Typography
                    variant="overline"
                    sx={{ fontWeight: 800, letterSpacing: 2, lineHeight: 1 }}
                    >
                    Busca e filtros
                    </Typography>
                </Box>

                <Box
                    sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                    }}
                >
                    <AppSearch
                    placeholder="Buscar exercício por nome..."
                    onSearch={setSearchTerm}
                    />

                    <AppSelectField
                    label="Grupo muscular"
                    value={grupoMuscularFilter}
                    options={grupoOptions}
                    onChange={(e) => setGrupoMuscularFilter(String(e.target.value))}
                    />
                </Box>
                </Paper>
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
                loading={submitting}
                onClose={handleFechar}
                onSubmit={handleSalvar}
            />
            }
        />

        <ConfirmDialog
            open={deleteDialogOpen}
            severity="error"
            loading={deleting}
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