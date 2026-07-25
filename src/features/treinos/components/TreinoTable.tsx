import { Chip } from "@mui/material";
import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Treino } from "../types";

type Props = {
    data: Treino[];
    onEdit: (treino: Treino) => void;
    onDelete: (treino: Treino) => void;
    onStatus?: (treino: Treino) => void;
};

export default function TreinoTable({
    data,
    onEdit,
    onDelete,
    onStatus,
}: Props) {
    const columns: CrudColumn<Treino>[] = [
        {
            field: "nome",
            header: "Nome",
        },
        {
            field: "nomeAluno",
            header: "Aluno",
            render: (treino) => treino.nomeAluno ?? "-",
        },
        {
            field: "nomePersonal",
            header: "Personal",
            render: (treino) => treino.nomePersonal ?? "-",
        },
        {
            field: "dataInicio",
            header: "Início",
            render: (treino) => treino.dataInicio ?? "-",
        },
        {
            field: "dataFim",
            header: "Fim",
            render: (treino) => treino.dataFim ?? "-",
        },
        {
            field: "ativo",
            header: "Status",
            render: (treino) => (
                <Chip
                    label={treino.ativo ? "Ativo" : "Inativo"}
                    color={treino.ativo ? "success" : "default"}
                    size="small"
                />
            ),
        },
        {
            field: "id",
            header: "Ações",
            align: "center",
            width: 160,
            render: (treino) => (
                <CrudActions
                    onEdit={() => onEdit(treino)}
                    onDelete={() => onDelete(treino)}
                    onDeactivate={onStatus ? () => onStatus(treino) : undefined}
                />
            ),
        },
    ];

    return (
        <CrudTable<Treino>
            columns={columns}
            rows={data}
            rowKey={(treino) => treino.id}
        />
    );
}