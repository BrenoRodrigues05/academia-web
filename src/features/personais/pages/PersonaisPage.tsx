import { useState } from "react";
import { Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material"; 

import CrudPage from "@/components/crud/CrudPage";
import {
    AppPagination,
    AppLoading,
    } from "@/components/ui";
    import {
    LoadingOverlay,
    EmptyState,
    ErrorState,
    } from "@/components/feedback";
    import { PersonalDialog, PersonalTable } from "../components";
    import CrudToolbar from "@/components/crud/CrudToolbar";
    import usePersonais from "../hooks/usePersonais";
    import ConfirmDialog from "@/components/feedback/ConfirmDialog";
    import type { Personal } from "../types/Personal"; 
    import { Sexo } from "@/shared/enums/Sexo";

    type SexoFilterType = "todos" | Sexo;
    type StatusFilterType = "todos" | "ativos" | "inativos";
    type SearchType = "nome" | "email" | "cref";

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
    
    const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilterType>("todos");

    const [searchType, setSearchType] = useState<SearchType>("nome");
    const [searchQuery, setSearchQuery] = useState("");

    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [personalTarget, setPersonalTarget] = useState<Personal | null>(null);

    const [sexoFilter, setSexoFilter] = useState<SexoFilterType>("todos");

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
        try {
        await desativar(personalTarget); 
        } catch (error) {
        console.error("Falha ao alterar status do personal:", error);
        } finally {
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
        try {
        await remove(personalTarget.id);
        } catch (error) {
        console.error("Falha ao deletar personal:", error);
        } finally {
        setDeleteDialogOpen(false);
        setPersonalTarget(null);
        }
    };

    const handleSearch = (texto: string) => {
        setSearchQuery(texto);
        if (searchType === "nome") {
        searchByNome(texto);
        } else if (searchType === "email") {
        searchByEmail?.(texto); 
        } else {
        searchByCref?.(texto);
        }
    };

    const handleSearchTypeChange = (novoTipo: SearchType) => {
        setSearchType(novoTipo);
        if (searchQuery.trim()) {
        if (novoTipo === "nome") {
            searchByNome(searchQuery);
        } else if (novoTipo === "email") {
            searchByEmail?.(searchQuery);
        } else {
            searchByCref?.(searchQuery);
        }
        }
    };

    const filteredPersonais = (data && Array.isArray(data.content))
    ? data.content.filter((personal) => {
        const passaStatus = statusFilter === "todos" 
            ? true 
            : (personal.ativo ?? false) === (statusFilter === "ativos");
        
        const passaSexo = sexoFilter === "todos" 
            ? true 
            : personal.sexo === sexoFilter;

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
            onRetry={() => handleSearch(searchQuery)} 
            />
        );
        }

        if (filteredPersonais.length === 0) {
        return <EmptyState message="Nenhum personal encontrado para os filtros selecionados." />;
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                <Box sx={{ flexGrow: 1, width: "100%" }}>
                <CrudToolbar
                    title="Personais"
                    subtitle="Gerenciamento de personal trainers"
                    searchPlaceholder={`Pesquisar por ${searchType.toUpperCase()}`}
                    createLabel="Novo Personal"
                    onCreate={handleCreateOpen} 
                    onSearch={handleSearch}
                />
                </Box>
                
                <Box sx={{ 
                display: "flex", 
                flexDirection: "row", 
                gap: 2,             
                width: "100%", 
                mt: -1,
                flexWrap: "wrap"      
                }}>
                <FormControl size="small" sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}>
                    <InputLabel id="search-type-label">Buscar por</InputLabel>
                    <Select
                    labelId="search-type-label"
                    value={searchType}
                    label="Buscar por"
                    onChange={(e) => handleSearchTypeChange(e.target.value as SearchType)}
                    >
                    <MenuItem value="nome">Nome</MenuItem>
                    <MenuItem value="email">E-mail</MenuItem>
                    <MenuItem value="cref">CREF</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}>
                    <InputLabel id="status-filter-label">Status do Usuário</InputLabel>
                    <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status do Usuário"
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
                    >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="ativos">Ativos</MenuItem>
                    <MenuItem value="inativos">Inativos</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}>
                    <InputLabel id="sexo-filter-label">Gênero</InputLabel>
                    <Select
                    labelId="sexo-filter-label"
                    value={sexoFilter}
                    label="Gênero"
                    onChange={(e) => setSexoFilter(e.target.value as SexoFilterType)}
                    >
                    <MenuItem value="todos">Todos os gêneros</MenuItem>
                    <MenuItem value={Sexo.MASCULINO}>Masculino</MenuItem>
                    <MenuItem value={Sexo.FEMININO}>Feminino</MenuItem>
                    </Select>
                </FormControl>
                </Box>
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
            title={personalTarget?.ativo ? "Desativar Personal" : "Ativar Personal"}
            message={`Deseja realmente ${personalTarget?.ativo ? "desativar" : "ativar"} o cadastro do personal ${personalTarget?.nome}?`}
            confirmText={personalTarget?.ativo ? "Desativar" : "Ativar"}
            onCancel={() => setDeactivateDialogOpen(false)}
            onConfirm={confirmDeactivate}
        />

        <ConfirmDialog
            open={deleteDialogOpen}
            severity="error" 
            title="Excluir Personal Permanentemente"
            message={`ATENÇÃO: Deseja realmente excluir permanentemente o personal ${personalTarget?.nome}? Esta ação não poderá ser desfeita.`}
            confirmText="Excluir"
            onCancel={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
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