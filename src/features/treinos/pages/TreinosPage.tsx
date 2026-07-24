import { useEffect, useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
import { AppPagination, AppLoading } from "@/components/ui";
import AppSnackbar from "@/components/feedback/AppSnackbar";

import useTreinos from "../hooks/useTreinos";
import useAlunos from "@/features/alunos/hooks/useAlunos";
import useExercicios from "@/features/exercicios/hooks/useExercicios";

import TreinoDialog from "../components/TreinoDialog";
import TreinoTable from "../components/TreinoTable";

import type { Treino } from "../types";
import type { TreinoFormData } from "../validation/treinoSchema";

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function TreinoPage() {
    const { user } = useAuth();
    const treinoHook = useTreinos();
    const alunoHook = useAlunos();
    const exercicioHook = useExercicios();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedTreino, setSelectedTreino] = useState<Treino | undefined>();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [treinoTarget, setTreinoTarget] = useState<Treino | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [alunoFilter, setAlunoFilter] = useState<string>("todos");

    useEffect(() => {
        alunoHook.reload();
        exercicioHook.reload();
    }, []);

    function handleNovo() {
        setSelectedTreino(undefined);
        setDialogOpen(true);
    }

    function handleEditar(treino: Treino) {
        setSelectedTreino(treino);
        setDialogOpen(true);
    }

    function handleClose() {
        if (!submitting) {
            setDialogOpen(false);
            setSelectedTreino(undefined);
        }
    }

    async function handleSubmit(data: TreinoFormData) {
        setSubmitting(true);
        try {
            if (selectedTreino) {
                await treinoHook.update(selectedTreino.id, data);
            } else {
                await treinoHook.create(data);
            }
            handleClose();
        } catch (error) {
            console.error("Erro ao salvar treino:", error);
        } finally {
            setSubmitting(false);
        }
    }

    function handleSolicitarExclusao(treino: Treino) {
        setTreinoTarget(treino);
        setDeleteDialogOpen(true);
    }

    async function confirmExcluir() {
        if (!treinoTarget) return;
        try {
            await treinoHook.remove(treinoTarget.id);
        } catch (error) {
            console.error("Erro ao excluir treino:", error);
        } finally {
            setDeleteDialogOpen(false);
            setTreinoTarget(null);
        }
    }

    const rawList: Treino[] = Array.isArray(treinoHook.data)
        ? treinoHook.data
        : Array.isArray(treinoHook.data?.content)
        ? treinoHook.data.content
        : [];

    const alunosList = Array.isArray(alunoHook.data)
        ? alunoHook.data
        : Array.isArray(alunoHook.data?.content)
        ? alunoHook.data.content
        : [];

    const exerciciosList = Array.isArray(exercicioHook.data)
        ? exercicioHook.data
        : Array.isArray(exercicioHook.data?.content)
        ? exercicioHook.data.content
        : [];

    const filteredTreinos = rawList.filter((treino) => {
    const passaNome =
        !searchTerm ||
        treino.nome?.toLowerCase().includes(searchTerm.trim().toLowerCase());

    const alunoIdTreino = treino.aluno?.id ?? (treino as any).alunoId;

    const passaAluno =
        alunoFilter === "todos" ||
        String(alunoIdTreino) === String(alunoFilter);

    return passaNome && passaAluno;
});

    const renderTableContent = () => {
        if (treinoHook.loading) {
            return <AppLoading />;
        }

        if (!treinoHook.data) {
            return (
                <ErrorState
                    message="Não foi possível carregar os treinos."
                    onRetry={treinoHook.reload}
                />
            );
        }

        if (filteredTreinos.length === 0) {
            return (
                <EmptyState message="Nenhum treino encontrado para os filtros selecionados." />
            );
        }

        return (
            <TreinoTable
                data={filteredTreinos}
                onEdit={handleEditar}
                onDelete={handleSolicitarExclusao}
                onStatus={treinoHook.alterarStatus}
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
                                title="Treinos"
                                subtitle="Gerenciamento de fichas de treino dos alunos"
                                createLabel="Novo Treino"
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
                                sx={{
                                    minWidth: 220,
                                    flex: { xs: "1 1 100%", sm: "0 1 auto" },
                                }}
                            />

                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: 200,
                                    flex: { xs: "1 1 100%", sm: "0 1 auto" },
                                }}
                            >
                                <InputLabel id="aluno-filter-label">Aluno</InputLabel>
                                <Select
                                    labelId="aluno-filter-label"
                                    value={alunoFilter}
                                    label="Aluno"
                                    onChange={(e) => setAlunoFilter(String(e.target.value))}
                                >
                                    <MenuItem value="todos">Todos os alunos</MenuItem>
                                    {alunosList.map((aluno) => (
                                        <MenuItem key={aluno.id} value={String(aluno.id)}> 
                                            {aluno.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                }
                table={renderTableContent()}
                pagination={
                    !treinoHook.loading &&
                    treinoHook.data &&
                    filteredTreinos.length > 0 &&
                    "totalPages" in treinoHook.data ? (
                        <AppPagination
                            page={treinoHook.page}
                            totalPages={treinoHook.data.totalPages}
                            totalElements={treinoHook.data.totalElements}
                            onChange={treinoHook.setPage}
                        />
                    ) : undefined
                }
                dialogs={
                    <TreinoDialog
                        open={dialogOpen}
                        treino={selectedTreino}
                        alunos={alunosList}
                        exercicios={exerciciosList}
                        currentPersonalId={user?.id ?? 0}
                        onClose={handleClose}
                        onSubmit={handleSubmit}
                    />
                }
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                severity="error"
                title="Excluir Treino"
                message={`Deseja realmente excluir o treino "${treinoTarget?.nome}"?`}
                confirmText="Excluir"
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={confirmExcluir}
            />

            <AppSnackbar
                open={treinoHook.notification.open}
                message={treinoHook.notification.message}
                severity={treinoHook.notification.severity}
                onClose={treinoHook.closeNotification}
            />
        </>
    );
}