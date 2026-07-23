import {
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import type { Treino } from "../types";

type Props = {
    data: {
        content: Treino[];
        totalElements: number;
        totalPages: number;
    };
    page: number;
    rowsPerPage: number;
    onPageChange: (
        page: number
    ) => void;

    onRowsPerPageChange: (
        rows: number
    ) => void;

    onEdit: (
        treino: Treino
    ) => void;

    onDelete: (
        treino: Treino
    ) => void;

    onStatus: (
        treino: Treino
    ) => void;

};

export default function TreinoTable({
    data,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onEdit,
    onDelete,
    onStatus,
}: Props) {

    return (

        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>

                            Nome

                        </TableCell>

                        <TableCell>

                            Aluno

                        </TableCell>

                        <TableCell>

                            Personal

                        </TableCell>

                        <TableCell>

                            Início

                        </TableCell>

                        <TableCell>

                            Fim

                        </TableCell>

                        <TableCell>

                            Status

                        </TableCell>

                        <TableCell
                            align="center"
                        >

                            Ações

                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {data.content.map((treino) => (

                        <TableRow
                            key={treino.id}
                            hover
                        >

                            <TableCell>

                                {treino.nome}

                            </TableCell>

                            <TableCell>

                                {treino.aluno.nome}

                            </TableCell>

                            <TableCell>

                                {treino.personal.nome}

                            </TableCell>

                            <TableCell>

                                {treino.dataInicio}

                            </TableCell>

                            <TableCell>

                                {treino.dataFim ?? "-"}

                            </TableCell>

                            <TableCell>

                                <Chip

                                    label={
                                        treino.ativo
                                            ? "Ativo"
                                            : "Inativo"
                                    }

                                    color={
                                        treino.ativo
                                            ? "success"
                                            : "default"
                                    }

                                    size="small"

                                />

                            </TableCell>

                            <TableCell
                                align="center"
                            >

                                <Tooltip title="Editar">

                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            onEdit(treino)
                                        }
                                    >

                                        <EditIcon />

                                    </IconButton>

                                </Tooltip>

                                <Tooltip title="Alterar Status">

                                    <IconButton
                                        color="warning"
                                        onClick={() =>
                                            onStatus(treino)
                                        }
                                    >

                                        <AutorenewIcon />

                                    </IconButton>

                                </Tooltip>

                                <Tooltip title="Excluir">

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            onDelete(treino)
                                        }
                                    >

                                        <DeleteIcon />

                                    </IconButton>

                                </Tooltip>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

            <TablePagination

                component="div"

                count={data.totalElements}

                page={page}

                rowsPerPage={rowsPerPage}

                onPageChange={(_, page) =>

                    onPageChange(page)

                }

                onRowsPerPageChange={(event) =>

                    onRowsPerPageChange(

                        Number(event.target.value)

                    )

                }

                rowsPerPageOptions={[5, 10, 20]}

            />

        </TableContainer>

    );

}