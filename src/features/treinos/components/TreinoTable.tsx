import { Chip, IconButton, Stack, Tooltip } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Treino } from "../types";

type Props = {
    data: Treino[];
    onEdit: (treino: Treino) => void;
    onDelete: (treino: Treino) => void;
    onStatus?: (treino: Treino) => void;
    onReatribuirPersonal?: (treino: Treino) => void;
};

export default function TreinoTable({
    data,
    onEdit,
    onDelete,
    onStatus,
    onReatribuirPersonal,
}: Props) {
    const columns: CrudColumn<Treino>[] = [
        {
            field: "nome",
            header: "Nome",
        },
        {
            field: "nomeAluno",
            header: "Aluno",
            render: (treino) => treino.nomeAluno ?? treino.aluno?.nome ?? "-",
        },
        {
            field: "nomePersonal",
            header: "Personal",
            render: (treino) => treino.nomePersonal ?? treino.personal?.nome ?? "-",
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
            field: "acoes",
            header: "Ações",
            align: "center",
            width: 180,
            render: (treino) => (
                <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ justifyContent: "center", alignItems: "center" }}
                >
                    {onReatribuirPersonal && (
                        <Tooltip title="Trocar Personal">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onReatribuirPersonal(treino)}
                            >
                                <SwapHorizIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    <CrudActions
                        onEdit={() => onEdit(treino)}
                        onDelete={() => onDelete(treino)}
                        onDeactivate={onStatus ? () => onStatus(treino) : undefined}
                    />
                </Stack>
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