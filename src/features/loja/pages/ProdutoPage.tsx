import { useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import { LoadingOverlay, EmptyState, ErrorState } from "@/components/feedback";
import { AppPagination, AppLoading } from "@/components/ui";
import AppSnackbar from "@/components/feedback/AppSnackbar";

import useProdutos from "../hooks/useProdutos";
import ProdutoTable from "../components/ProdutoTable";
import ProdutoDialog from "../components/ProdutoDialog";

import type { Produto } from "../types";
import type { ProdutoFormData } from "../validation/produtoSchema";

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ProdutoPage() {
    const { user } = useAuth();
    const isAdminOrSuperAdmin = Boolean(
        user?.role && ["SUPER_ADMIN", "ADMIN"].includes(user.role)
    );

    const produtoHook = useProdutos();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedProduto, setSelectedProduto] = useState<Produto | undefined>();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [produtoTarget, setProdutoTarget] = useState<Produto | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [estoqueFilter, setEstoqueFilter] = useState<string>("todos");

    function handleNovo() {
        setSelectedProduto(undefined);
        setDialogOpen(true);
    }

    function handleEditar(produto: Produto) {
        setSelectedProduto(produto);
        setDialogOpen(true);
    }

    function handleClose() {
        if (!submitting) {
            setDialogOpen(false);
            setSelectedProduto(undefined);
        }
    }

    async function handleSubmit(data: ProdutoFormData) {
        setSubmitting(true);
        try {
            if (selectedProduto) {
                await produtoHook.update(selectedProduto.id, data);
            } else {
                await produtoHook.create(data);
            }
            handleClose();
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
        } finally {
            setSubmitting(false);
        }
    }

    function handleSolicitarExclusao(produto: Produto) {
        setProdutoTarget(produto);
        setDeleteDialogOpen(true);
    }

    async function confirmExcluir() {
        if (!produtoTarget) return;
        try {
            await produtoHook.remove(produtoTarget.id);
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
        } finally {
            setDeleteDialogOpen(false);
            setProdutoTarget(null);
        }
    }

    const rawList: Produto[] = Array.isArray(produtoHook.data)
        ? produtoHook.data
        : Array.isArray(produtoHook.data?.content)
        ? produtoHook.data.content
        : [];

    const filteredProdutos = rawList.filter((produto) => {
        const passaNome =
            !searchTerm ||
            produto.nome?.toLowerCase().includes(searchTerm.trim().toLowerCase());

        const estoque = produto.estoque ?? 0;
        let passaEstoque = true;
        if (estoqueFilter === "disponivel") {
            passaEstoque = estoque > 0;
        } else if (estoqueFilter === "esgotado") {
            passaEstoque = estoque === 0;
        }

        return passaNome && passaEstoque;
    });

    const renderTableContent = () => {
        if (produtoHook.loading) {
            return <AppLoading />;
        }

        if (!produtoHook.data) {
            return (
                <ErrorState
                    message="Não foi possível carregar os produtos."
                    onRetry={produtoHook.reload}
                />
            );
        }

        if (filteredProdutos.length === 0) {
            return (
                <EmptyState message="Nenhum produto encontrado para os filtros selecionados." />
            );
        }

        return (
            <ProdutoTable
                data={filteredProdutos}
                onEdit={handleEditar}
                onDelete={handleSolicitarExclusao}
                isAdmin={isAdminOrSuperAdmin}
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
                                title="Produtos"
                                subtitle="Gerenciamento de produtos e estoque da academia"
                                createLabel="Novo Produto"
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
                                    minWidth: 200,
                                    flex: { xs: "1 1 100%", sm: "1 1 200px" },
                                }}
                            />

                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: 160,
                                    flex: { xs: "1 1 100%", sm: "0 1 160px" },
                                }}
                            >
                                <InputLabel id="estoque-filter-label">Estoque</InputLabel>
                                <Select
                                    labelId="estoque-filter-label"
                                    value={estoqueFilter}
                                    label="Estoque"
                                    onChange={(e) => setEstoqueFilter(String(e.target.value))}
                                >
                                    <MenuItem value="todos">Todos</MenuItem>
                                    <MenuItem value="disponivel">Disponíveis</MenuItem>
                                    <MenuItem value="esgotado">Esgotados</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                }
                table={renderTableContent()}
                pagination={
                    !produtoHook.loading &&
                    produtoHook.data &&
                    filteredProdutos.length > 0 &&
                    typeof produtoHook.data === "object" &&
                    "totalPages" in produtoHook.data ? (
                        <AppPagination
                            page={produtoHook.page}
                            totalPages={(produtoHook.data as any).totalPages}
                            totalElements={(produtoHook.data as any).totalElements}
                            onChange={produtoHook.setPage}
                        />
                    ) : undefined
                }
                dialogs={
                    <>
                        <ProdutoDialog
                            open={dialogOpen}
                            produto={selectedProduto}
                            onClose={handleClose}
                            onSubmit={handleSubmit}
                        />
                    </>
                }
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                severity="error"
                title="Excluir Produto"
                message={`Deseja realmente excluir o produto "${produtoTarget?.nome}"?`}
                confirmText="Excluir"
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={confirmExcluir}
            />

            <AppSnackbar
                open={produtoHook.notification.open}
                message={produtoHook.notification.message}
                severity={produtoHook.notification.severity}
                onClose={produtoHook.closeNotification}
            />
        </>
    );
}