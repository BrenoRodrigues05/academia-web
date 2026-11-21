import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FilterAlt, FilterAltOff } from "@mui/icons-material";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import { AppPagination, AppLoading, AppSearch } from "@/components/ui";
import { AppSelectField } from "@/components/forms";
import {
    LoadingOverlay,
    EmptyState,
    ErrorState,
    } from "@/components/feedback";
    import ConfirmDialog from "@/components/feedback/ConfirmDialog";
    import AppSnackbar from "@/components/feedback/AppSnackbar";
    import { PersonalDialog, PersonalTable } from "../components";
    import usePersonais from "../hooks/usePersonais";
    import type { Personal } from "../types/Personal";
    import { Sexo } from "@/shared/enums/Sexo";

    type SexoFilterType = "todos" | Sexo;
    type StatusFilterType = "todos" | "ativos" | "inativos";
    type SearchType = "nome" | "email" | "cref";

    const searchTypeOptions = [
    { value: "nome", label: "Nome" },
    { value: "email", label: "E-mail" },
    { value: "cref", label: "CREF" },
    ];

    const statusOptions = [
    { value: "todos", label: "Todos" },
    { value: "ativos", label: "Ativos" },
    { value: "inativos", label: "Inativos" },
    ];

    const sexoOptions = [
    { value: "todos", label: "Todos os gêneros" },
    { value: Sexo.MASCULINO, label: "Masculino" },
    { value: Sexo.FEMININO, label: "Feminino" },
    ];

    const searchLabels: Record<SearchType, string> = {
    nome: "nome",
    email: "e-mail",
    cref: "CREF",
    };

    export default function PersonaisPage() {
    const {
        data,
        loading,
        page,
        setPage,
        isSearching,
        searchByNome,
        searchByEmail,
        searchByCref,
        create,
        update,
        desativar,
        remove,
        notification,
        closeNotification,
    } = usePersonais();

    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null);

    const [searchType, setSearchType] = useState<SearchType>("nome");
    const [searchQuery, setSearchQuery] = useState("");

    const [statusFilter, setStatusFilter] = useState<StatusFilterType>("todos");
    const [sexoFilter, setSexoFilter] = useState<SexoFilterType>("todos");

    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [personalTarget, setPersonalTarget] = useState<Personal | null>(null);

    const hasFilters = statusFilter !== "todos" || sexoFilter !== "todos";

    const clearFilters = () => {
        setStatusFilter("todos");
        setSexoFilter("todos");
    };

    const handleCreateOpen = () => {
        setSelectedPersonal(null);
        setOpen(true);
    };

    const handleEditOpen = (personal: Personal) => {
        setSelectedPersonal(personal);
        setOpen(true);
    };

    const handleClose = () => {
        if (!submitting) {
        setOpen(false);
        setSelectedPersonal(null);
        }
    };

    const handleDeactivateClick = (personal: Personal) => {
        if (!personal || personal.id === undefined) return;
        setPersonalTarget(personal);
        setDeactivateDialogOpen(true);
    };

    const confirmDeactivate = async () => {
        if (!personalTarget) return;
        setConfirming(true);
        try {
        await desativar(personalTarget);
        } catch (error) {
        console.error("Falha ao alterar status do personal:", error);
        } finally {
        setConfirming(false);
        setDeactivateDialogOpen(false);
        setPersonalTarget(null);
        }
    };

    const handleDeleteClick = (personal: Personal) => {
        if (!personal || personal.id === undefined) return;
        setPersonalTarget(personal);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!personalTarget || personalTarget.id === undefined) return;
        setConfirming(true);
        try {
        await remove(personalTarget.id);
        } catch (error) {
        console.error("Falha ao deletar personal:", error);
        } finally {
        setConfirming(false);
        setDeleteDialogOpen(false);
        setPersonalTarget(null);
        }
    };

    const runSearch = (texto: string, tipo: SearchType) => {
        if (tipo === "nome") {
        searchByNome(texto);
        } else if (tipo === "email") {
        searchByEmail?.(texto);
        } else {
        searchByCref?.(texto);
        }
    };

    const handleSearch = (texto: string) => {
        if (texto === searchQuery) return;
        setSearchQuery(texto);
        runSearch(texto, searchType);
    };

    const handleSearchTypeChange = (novoTipo: SearchType) => {
        setSearchType(novoTipo);
        if (searchQuery.trim()) {
        runSearch(searchQuery, novoTipo);
        }
    };

    const filteredPersonais =
        data && Array.isArray(data.content)
        ? data.content.filter((personal) => {
            const passaStatus =
                statusFilter === "todos"
                ? true
                : (personal.ativo ?? false) === (statusFilter === "ativos");

            const passaSexo =
                sexoFilter === "todos" ? true : personal.sexo === sexoFilter;

            return passaStatus && passaSexo;
            })
        : [];

    const renderTableContent = () => {
        if (loading) {
        return <AppLoading />;
        }

        if (!data) {
        return (
            <ErrorState
            message="Não foi possível carregar a lista de personais. Verifique sua conexão."
            onRetry={() => runSearch(searchQuery, searchType)}
            />
        );
        }

        if (filteredPersonais.length === 0) {
        return (
            <EmptyState message="Nenhum personal encontrado para os filtros selecionados." />
        );
        }

        return (
        <PersonalTable
            personais={filteredPersonais}
            onEdit={handleEditOpen}
            onDelete={handleDeleteClick}
            onDeactivate={handleDeactivateClick}
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
                title="Personais"
                subtitle="Gerenciamento de personal trainers"
                createLabel="Novo Personal"
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
                        Busca e filtros
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

                <Box sx={{ display: "grid", gap: 2 }}>
                    <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
                    }}
                    >
                    <AppSearch
                        placeholder={`Buscar personal por ${searchLabels[searchType]}...`}
                        onSearch={handleSearch}
                    />
                    <AppSelectField
                        label="Buscar por"
                        value={searchType}
                        options={searchTypeOptions}
                        onChange={(e) =>
                        handleSearchTypeChange(e.target.value as SearchType)
                        }
                    />
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
                        setStatusFilter(e.target.value as StatusFilterType)
                        }
                    />

                    <AppSelectField
                        label="Gênero"
                        value={sexoFilter}
                        options={sexoOptions}
                        onChange={(e) =>
                        setSexoFilter(e.target.value as SexoFilterType)
                        }
                    />
                    </Box>
                </Box>
                </Paper>
            </Box>
            }
            table={renderTableContent()}
            pagination={
            !loading && data && !isSearching && filteredPersonais.length > 0 ? (
                <AppPagination
                page={page}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                onChange={setPage}
                />
            ) : undefined
            }
            dialogs={
            <PersonalDialog
                open={open}
                title={selectedPersonal ? "Editar Personal" : "Novo Personal"}
                loading={submitting}
                personal={selectedPersonal}
                onClose={handleClose}
                onSubmit={async (formData) => {
                setSubmitting(true);
                try {
                    if (selectedPersonal) {
                    await update?.(selectedPersonal.id, formData);
                    } else {
                    await create(formData);
                    }
                    handleClose();
                } catch (error) {
                    console.error("Falha na submissão:", error);
                } finally {
                    setSubmitting(false);
                }
                }}
            />
            }
        />

        <ConfirmDialog
            open={deactivateDialogOpen}
            severity="warning"
            loading={confirming}
            title={personalTarget?.ativo ? "Desativar Personal" : "Ativar Personal"}
            message={`Deseja realmente ${personalTarget?.ativo ? "desativar" : "ativar"} o cadastro do personal ${personalTarget?.nome}?`}
            confirmText={personalTarget?.ativo ? "Desativar" : "Ativar"}
            onCancel={() => setDeactivateDialogOpen(false)}
            onConfirm={confirmDeactivate}
        />

        <ConfirmDialog
            open={deleteDialogOpen}
            severity="error"
            loading={confirming}
            title="Excluir Personal Permanentemente"
            message={`ATENÇÃO: Deseja realmente excluir permanentemente o personal ${personalTarget?.nome}? Esta ação não poderá ser desfeita.`}
            confirmText="Excluir"
            onCancel={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
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