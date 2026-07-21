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
    import { AppPagination, AppLoading } from "@/components/ui";
    import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
    import CrudToolbar from "@/components/crud/CrudToolbar";
    import ConfirmDialog from "@/components/feedback/ConfirmDialog";

    import usePlanos from "../hooks/usePlanos";
    import type { Plano } from "../types/Plano";
    import { TipoPlano } from "@/shared/enums/TipoPlano";
    import { PlanoDialog, PlanoTable } from "../components";

    type TipoFilterType = "todos" | TipoPlano;
    type ValorRangeType = "todos" | "0-50" | "50-100" | "100-200" | "200+";

    export default function PlanosPage() {
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
    } = usePlanos();

    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedPlano, setSelectedPlano] = useState<Plano | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [planoTarget, setPlanoTarget] = useState<Plano | null>(null);

    const [tipoFilter, setTipoFilter] = useState<TipoFilterType>("todos");
    const [valorRangeFilter, setValorRangeFilter] = useState<ValorRangeType>("todos");

    const handleCreateOpen = () => {
        setSelectedPlano(null);
        setOpen(true);
    };

    const handleEditOpen = (plano: Plano) => {
        setSelectedPlano(plano);
        setOpen(true);
    };

    const handleClose = () => {
        if (!submitting) {
        setOpen(false);
        setSelectedPlano(null);
        }
    };

    const handleDeleteClick = (plano: Plano) => {
        if (!plano || plano.id === undefined) return;
        setPlanoTarget(plano);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!planoTarget || planoTarget.id === undefined) return;
        try {
        await remove(planoTarget.id);
        } catch (error) {
        console.error("Falha ao deletar plano:", error);
        } finally {
        setDeleteDialogOpen(false);
        setPlanoTarget(null);
        }
    };

    const rawList: Plano[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

    const filteredPlanos = rawList.filter((plano) => {
        const passaTipo =
        tipoFilter === "todos" ||
        plano.tipo?.toString().toUpperCase() === tipoFilter.toString().toUpperCase();

        let passaValor = true;
        const val = Number(plano.valor) || 0;

        switch (valorRangeFilter) {
        case "0-50":
            passaValor = val <= 50;
            break;
        case "50-100":
            passaValor = val > 50 && val <= 100;
            break;
        case "100-200":
            passaValor = val > 100 && val <= 200;
            break;
        case "200+":
            passaValor = val > 200;
            break;
        default:
            passaValor = true;
        }

        return passaTipo && passaValor;
    });

    const renderTableContent = () => {
        if (loading) {
        return <AppLoading />;
        }

        if (!data) {
        return (
            <ErrorState
            message="Não foi possível carregar a lista de planos. Verifique sua conexão."
            onRetry={reload}
            />
        );
        }

        if (filteredPlanos.length === 0) {
        return (
            <EmptyState message="Nenhum plano encontrado para os filtros selecionados." />
        );
        }

        return (
        <PlanoTable
            planos={filteredPlanos}
            onEdit={handleEditOpen}
            onDelete={handleDeleteClick}
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
                    title="Planos"
                    subtitle="Gerenciamento de planos"
                    createLabel="Novo Plano"
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
                    sx={{ minWidth: 200, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
                >
                    <InputLabel id="tipo-filter-label">Tipo do Plano</InputLabel>
                    <Select
                    labelId="tipo-filter-label"
                    value={tipoFilter}
                    label="Tipo do Plano"
                    onChange={(e) =>
                        setTipoFilter(e.target.value as TipoFilterType)
                    }
                    >
                    <MenuItem value="todos">Todos os tipos</MenuItem>
                    {Object.values(TipoPlano).map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                        {tipo}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl
                    size="small"
                    sx={{ minWidth: 200, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
                >
                    <InputLabel id="valor-range-label">Faixa de Valor</InputLabel>
                    <Select
                    labelId="valor-range-label"
                    value={valorRangeFilter}
                    label="Faixa de Valor"
                    onChange={(e) =>
                        setValorRangeFilter(e.target.value as ValorRangeType)
                    }
                    >
                    <MenuItem value="todos">Todos os valores</MenuItem>
                    <MenuItem value="0-50">Até R$ 50,00</MenuItem>
                    <MenuItem value="50-100">R$ 50,01 a R$ 100,00</MenuItem>
                    <MenuItem value="100-200">R$ 100,01 a R$ 200,00</MenuItem>
                    <MenuItem value="200+">Acima de R$ 200,00</MenuItem>
                    </Select>
                </FormControl>
                </Box>
            </Box>
            }
            table={renderTableContent()}
            pagination={
            !loading &&
            data &&
            filteredPlanos.length > 0 &&
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
            <PlanoDialog
                open={open}
                title={selectedPlano ? "Editar Plano" : "Novo Plano"}
                loading={submitting}
                plano={selectedPlano}
                onClose={handleClose}
                onSubmit={async (formData) => {
                setSubmitting(true);
                try {
                    if (selectedPlano) {
                    await update(selectedPlano.id!, formData);
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
            open={deleteDialogOpen}
            severity="error"
            title="Excluir Plano Permanentemente"
            message={`ATENÇÃO: Deseja realmente excluir permanentemente o plano ${planoTarget?.nome}? Esta ação não poderá ser desfeita.`}
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