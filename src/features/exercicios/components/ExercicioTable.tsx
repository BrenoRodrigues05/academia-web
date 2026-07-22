import {
    IconButton,
    Tooltip,
    Box,
} from "@mui/material";

import {
    DataGrid,
    type GridColDef,
    type GridRenderCellParams,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Exercicio } from "../types";

type Props = {
    exercicios: Exercicio[];
    onEdit: (exercicio: Exercicio) => void;
    onDelete: (exercicio: Exercicio) => void;
};

export default function ExercicioTable({
    exercicios,
    onEdit,
    onDelete,
}: Props) {

    const columns: GridColDef<Exercicio>[] = [
        {
            field: "id",
            headerName: "ID",
            width: 90,
        },
        {
            field: "nome",
            headerName: "Nome",
            flex: 1,
            minWidth: 220,
        },
        {
            field: "grupoMuscular",
            headerName: "Grupo Muscular",
            flex: 1,
            minWidth: 180,
        },
        {
            field: "descricao",
            headerName: "Descrição",
            flex: 2,
            minWidth: 300,
        },
        {
            field: "acoes",
            headerName: "Ações",
            width: 120,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<Exercicio>) => (
                <>
                    <Tooltip title="Editar">
                        <IconButton
                            color="primary"
                            onClick={() => onEdit(params.row)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Excluir">
                        <IconButton
                            color="error"
                            onClick={() => onDelete(params.row)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ width: "100%" }}>
            <DataGrid
                rows={exercicios}
                columns={columns}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[10, 20, 50]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
            />
        </Box>
    );
}