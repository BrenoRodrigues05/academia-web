import { useState } from "react";
import {
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    } from "@mui/material";

    import CrudPage from "@/components/crud/CrudPage";
    import CrudToolbar from "@/components/crud/CrudToolbar";
    import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
    import { AppPagination, AppLoading } from "@/components/ui";

    import useMatriculas from "../hooks/useMatriculas";
    import MatriculasTable from "../components/MatriculasTable";
    import MatriculasDialog from "../components/MatriculasDialog";

    import type { Matricula } from "../types";
    import type { MatriculaFormData } from "../validation/matriculasSchema";

    type StatusMatriculaFilter = "todos" | "ativas" | "inativas";
    type PlanoFilter = "todos" | string;

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
                    title="Matrículas"
                    subtitle="Gerenciamento de matrículas de alunos"
                    createLabel="Nova Matrícula"
                    onCreate={handleCreateOpen}
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
                <FormControl
                    size="small"
                    sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
                >
                    <InputLabel id="status-matricula-filter-label">
                    Status
                    </InputLabel>
                    <Select
                    labelId="status-matricula-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={(e) =>
                        setStatusFilter(e.target.value as StatusMatriculaFilter)
                    }
                    >
                    <MenuItem value="todos">Todas</MenuItem>
                    <MenuItem value="ativas">Ativas</MenuItem>
                    <MenuItem value="inativas">Inativas</MenuItem>
                    </Select>
                </FormControl>

                {planos && planos.length > 0 && (
                    <FormControl
                    size="small"
                    sx={{ minWidth: 200, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
                    >
                    <InputLabel id="plano-filter-label">
                        Filtrar por Plano
                    </InputLabel>
                    <Select
                        labelId="plano-filter-label"
                        value={planoFilter}
                        label="Filtrar por Plano"
                        onChange={(e) => setPlanoFilter(e.target.value as string)}
                    >
                        <MenuItem value="todos">Todos os planos</MenuItem>
                        {planos.map((plano) => (
                        <MenuItem key={plano.id} value={String(plano.id)}>
                            {plano.nome}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                )}
                </Box>
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
                loading={submitting}
                matricula={selectedMatricula}
            />
            }
        />

        <Snackbar
            open={notification.open}
            autoHideDuration={4000}
            onClose={closeNotification}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <Alert
            onClose={closeNotification}
            severity={notification.severity}
            variant="filled"
            sx={{ width: "100%" }}
            >
            {notification.message}
            </Alert>
        </Snackbar>
        </>
    );
}