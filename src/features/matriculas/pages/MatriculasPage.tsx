import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FilterAlt, FilterAltOff } from "@mui/icons-material";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
import AppSnackbar from "@/components/feedback/AppSnackbar";
import { AppPagination, AppLoading } from "@/components/ui";
import { AppSelectField } from "@/components/forms";

import useMatriculas from "../hooks/useMatriculas";
import MatriculasTable from "../components/MatriculasTable";
import MatriculasDialog from "../components/MatriculasDialog";

import type { Matricula } from "../types";
import type { MatriculaFormData } from "../validation/matriculasSchema";

type StatusMatriculaFilter = "todos" | "ativas" | "inativas";
type PlanoFilter = "todos" | string;

const statusOptions = [
    { value: "todos", label: "Todas" },
    { value: "ativas", label: "Ativas" },
    { value: "inativas", label: "Inativas" },
    ];

    export default function MatriculasPage() {
    const {
        data,
        loading,
        page,
        setPage,
        alunos,
        planos,
        loadReferenceData,
        create,
        update,
        toggleStatus,
        notification,
        closeNotification,
    } = useMatriculas();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedMatricula, setSelectedMatricula] = useState<Matricula | undefined>(undefined);

    const [statusFilter, setStatusFilter] = useState<StatusMatriculaFilter>("todos");
    const [planoFilter, setPlanoFilter] = useState<PlanoFilter>("todos");

    const hasFilters = statusFilter !== "todos" || planoFilter !== "todos";

    const clearFilters = () => {
        setStatusFilter("todos");
        setPlanoFilter("todos");
    };

    const planoOptions = [
        { value: "todos", label: "Todos os planos" },
        ...(planos ?? []).map((plano) => ({
        value: String(plano.id),
        label: plano.nome,
        })),
    ];

    const handleCreateOpen = async () => {
        setSelectedMatricula(undefined);
        await loadReferenceData();
        setDialogOpen(true);
    };

    const handleEditOpen = async (matricula: Matricula) => {
        setSelectedMatricula(matricula);
        await loadReferenceData();
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        if (!submitting) {
        setDialogOpen(false);
        setSelectedMatricula(undefined);
        }
    };

    const handleSubmit = async (formData: MatriculaFormData) => {
        setSubmitting(true);
        try {
        if (selectedMatricula?.matricula) {
            await update(selectedMatricula.matricula, formData);
        } else {
            await create(formData);
        }
        handleDialogClose();
        } catch (error) {
        console.error("Erro ao salvar matrícula:", error);
        } finally {
        setSubmitting(false);
        }
    };

    const rawList: Matricula[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

    const filteredMatriculas = rawList.filter((matricula) => {
        const passaStatus =
        statusFilter === "todos"
            ? true
            : statusFilter === "ativas"
            ? Boolean(matricula.ativa)
            : !matricula.ativa;

        let passaPlano = true;
        if (planoFilter !== "todos") {
        const planoIdMatricula =
            typeof matricula.plano === "object"
            ? matricula.plano?.id
            : matricula.plano;

        passaPlano = String(planoIdMatricula) === String(planoFilter);
        }

        return passaStatus && passaPlano;
    });

    const renderTableContent = () => {
        if (loading) {
        return <AppLoading />;
        }

        if (!data) {
        return (
            <ErrorState
            message="Não foi possível carregar a lista de matrículas. Verifique sua conexão."
            onRetry={loadReferenceData}
            />
        );
        }

        if (filteredMatriculas.length === 0) {
        return (
            <EmptyState message="Nenhuma matrícula encontrada para os filtros selecionados." />
        );
        }

        return (
        <MatriculasTable
            matriculas={filteredMatriculas}
            onEdit={handleEditOpen}
            onToggleStatus={toggleStatus}
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
                title="Matrículas"
                subtitle="Gerenciamento de matrículas de alunos"
                createLabel="Nova Matrícula"
                onCreate={handleCreateOpen}
                />
                
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mt: -1 }}>
                <Box
                    sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FilterAlt sx={{ color: "primary.main" }} fontSize="small" />
                    <Typography
                        variant="overline"
                        sx={{ fontWeight: 800, letterSpacing: 2, lineHeight: 1 }}
                    >
                        Filtros
                    </Typography>
                    </Box>

                    {hasFilters && (
                    <Button
                        size="small"
                        color="inherit"
                        startIcon={<FilterAltOff />}
                        onClick={clearFilters}
                        sx={{ fontWeight: 700 }}
                    >
                        Limpar filtros
                    </Button>
                    )}
                </Box>

                <Box
                    sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    }}
                >
                    <AppSelectField
                    label="Status"
                    value={statusFilter}
                    options={statusOptions}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as StatusMatriculaFilter)
                    }
                    />

                    {planos && planos.length > 0 && (
                    <AppSelectField
                        label="Plano"
                        value={planoFilter}
                        options={planoOptions}
                        onChange={(e) => setPlanoFilter(String(e.target.value))}
                    />
                    )}
                </Box>
                </Paper>
            </Box>
            }
            table={renderTableContent()}
            pagination={
            !loading &&
            data &&
            filteredMatriculas.length > 0 &&
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
            <MatriculasDialog
                key={
                selectedMatricula?.matricula
                    ? `matricula-${selectedMatricula.matricula}`
                    : "nova-matricula"
                }
                open={dialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleSubmit}
                alunos={alunos}
                planos={planos}
                matriculas={rawList}
                loading={submitting}
                matricula={selectedMatricula}
            />
            }
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