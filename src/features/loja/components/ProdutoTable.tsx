import { Avatar, Box, Chip, Typography } from "@mui/material";
import { Inventory2Outlined } from "@mui/icons-material";

import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Produto } from "../types";

type Props = {
    data: Produto[];
    onEdit: (produto: Produto) => void;
    onDelete: (produto: Produto) => void;
    isAdmin: boolean;
    };

    const formatMoney = (valor: number | string) =>
    Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    export default function ProdutoTable({
    data,
    onEdit,
    onDelete,
    isAdmin,
    }: Props) {
    const columns: CrudColumn<Produto>[] = [
        {
        field: "nome",
        header: "Produto",
        render: (produto) => (
            <Box
            component="span"
            sx={{ display: "inline-flex", alignItems: "center", gap: 1.5 }}
            >
            <Avatar
                component="span"
                src={produto.imagemUrl}
                variant="rounded"
                alt={produto.nome}
                sx={{
                width: 44,
                height: 44,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
                }}
            >
                <Inventory2Outlined fontSize="small" />
            </Avatar>
            <Box component="span" sx={{ fontWeight: 700 }}>
                {produto.nome}
            </Box>
            </Box>
        ),
        },
        {
        field: "descricao",
        header: "Descrição",
        render: (produto) => (
            <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            title={produto.descricao}
            sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                maxWidth: 360,
            }}
            >
            {produto.descricao || "—"}
            </Typography>
        ),
        },
        {
        field: "preco",
        header: "Preço",
        render: (produto) => (
            <Box component="span" sx={{ fontWeight: 800, color: "primary.main" }}>
            {formatMoney(produto.preco)}
            </Box>
        ),
        },
        {
        field: "estoque",
        header: "Estoque",
        render: (produto) =>
            produto.estoque === 0 ? (
            <Chip label="Esgotado" size="small" color="error" sx={{ fontWeight: 700 }} />
            ) : (
            <Chip
                label={`${produto.estoque} un.`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
            />
            ),
        },
        ...(isAdmin
        ? [
            {
                field: "acoes" as keyof Produto,
                header: "Ações",
                align: "center" as const,
                width: 120,
                render: (produto: Produto) => (
                <CrudActions
                    onEdit={() => onEdit(produto)}
                    onDelete={() => onDelete(produto)}
                />
                ),
            },
            ]
        : []),
    ];

    return (
        <CrudTable<Produto>
        columns={columns}
        rows={data}
        rowKey={(produto) => produto.id}
        />
    );
}