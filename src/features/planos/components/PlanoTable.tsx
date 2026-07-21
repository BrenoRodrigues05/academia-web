import { Avatar, Chip } from "@mui/material";
import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Plano } from "../types";

type Props = {
    planos: Plano[];
    onEdit?: (plano: Plano) => void;
    onDelete?: (plano: Plano) => void;
};

export default function PlanoTable({
    planos,
    onEdit,
    onDelete,
}: Props) {
    const columns: CrudColumn<Plano>[] = [
        {
            field: "nome",
            header: "Nome",
        },
        {
            field: "descricao",
            header: "Descrição",
        },
        {
            field: "valor",
            header: "Valor",
            render: (plano) =>
                new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(plano.valor),
        },
        {
            field: "tipo",
            header: "Tipo",
            align: "center",
            render: (plano) => (
                <Chip
                    label={plano.tipo}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                />
            ),
        },
        {
            field: "imagemUrl",
            header: "Imagem",
            align: "center",
            render: (plano) =>
                plano.imagemUrl ? (
                    <Avatar
                        src={plano.imagemUrl}
                        alt={plano.nome}
                        variant="rounded"
                        sx={{ width: 40, height: 40, margin: "0 auto" }}
                    />
                ) : (
                    "-"
                ),
        },
        {
            field: "id",
            header: "Ações",
            align: "center",
            width: 120,
            render: (plano) => (
                <CrudActions
                    onEdit={() => onEdit?.(plano)}
                    onDelete={() => onDelete?.(plano)}
                />
            ),
        },
    ];

    return (
        <CrudTable<Plano>
            columns={columns}
            rows={planos}
            rowKey={(plano) => plano.id ?? plano.nome}
        />
    );
}