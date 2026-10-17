import { Avatar } from "@mui/material";
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

export default function ProdutoTable({
    data,
    onEdit,
    onDelete,
    isAdmin,
}: Props) {
    const columns: CrudColumn<Produto>[] = [
        {
            field: "imagemUrl",
            header: "Imagem",
            width: 80,
            render: (produto) => (
                <Avatar
                    src={produto.imagemUrl}
                    variant="rounded"
                    alt={produto.nome}
                    sx={{ width: 40, height: 40 }}
                >
                    {produto.nome?.charAt(0)}
                </Avatar>
            ),
        },
        {
            field: "nome",
            header: "Nome",
        },
        {
            field: "descricao",
            header: "Descrição",
            render: (produto) => produto.descricao ?? "-",
        },
        {
            field: "preco",
            header: "Preço",
            render: (produto) => `R$ ${Number(produto.preco).toFixed(2)}`,
        },
        {
            field: "estoque",
            header: "Estoque",
            render: (produto) => (
                <span style={{ color: produto.estoque === 0 ? "red" : "inherit" }}>
                    {produto.estoque} un.
                </span>
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