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

import useProdutos from "../hooks/useProdutos";
import ProdutoTable from "../components/ProdutoTable";
import ProdutoDialog from "../components/ProdutoDialog";

import type { Produto } from "../types";
import type { ProdutoFormData } from "../validation/produtoSchema";

import { useAuth } from "@/features/auth/hooks/useAuth";

const estoqueOptions = [
    { value: "todos", label: "Todos" },
    { value: "disponivel", label: "Disponíveis" },
    { value: "esgotado", label: "Esgotados" },
    ];

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
    const [deleting, setDeleting] = useState(false);
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
        setDeleting(true);
        try {
        await produtoHook.remove(produtoTarget.id);
        } catch (error) {
        console.error("Erro ao excluir produto:", error);
        } finally {
        setDeleting(false);
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
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <CrudToolbar
                title="Produtos"
                subtitle="Gerenciamento de produtos e estoque da academia"
                createLabel="Novo Produto"
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
                    placeholder="Buscar produto por nome..."
                    onSearch={setSearchTerm}
                    />

                    <AppSelectField
                    label="Estoque"
                    value={estoqueFilter}
                    options={estoqueOptions}
                    onChange={(e) => setEstoqueFilter(String(e.target.value))}
                    />
                </Box>
                </Paper>
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
            <ProdutoDialog
                open={dialogOpen}
                produto={selectedProduto}
                loading={submitting}
                onClose={handleClose}
                onSubmit={handleSubmit}
            />
            }
        />

        <ConfirmDialog
            open={deleteDialogOpen}
            severity="error"
            loading={deleting}
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