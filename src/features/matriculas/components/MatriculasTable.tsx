import {
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Matricula } from "../types";

interface MatriculasTableProps {
    matriculas: Matricula[];
    onEdit: (matricula: Matricula) => void;
    onDelete: (matricula: Matricula) => void;
}

export default function MatriculasTable({
    matriculas,
    onEdit,
    onDelete,
}: MatriculasTableProps) {

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={80}>
                            ID
                        </TableCell>

                        <TableCell>
                            Aluno
                        </TableCell>

                        <TableCell>
                            Plano
                        </TableCell>

                        <TableCell align="center">
                            Status
                        </TableCell>

                        <TableCell align="center">
                            Ações
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {matriculas.map((matricula) => (

                        <TableRow
                            key={matricula.id}
                            hover
                        >

                            <TableCell>

                                {matricula.id}

                            </TableCell>

                            <TableCell>

                                {matricula.aluno.nome}

                            </TableCell>

                            <TableCell>

                                {matricula.plano.nome}

                            </TableCell>

                            <TableCell align="center">

                                <Chip

                                    label={
                                        matricula.ativa
                                            ? "Ativa"
                                            : "Inativa"
                                    }

                                    color={
                                        matricula.ativa
                                            ? "success"
                                            : "default"
                                    }

                                    size="small"

                                />

                            </TableCell>

                            <TableCell align="center">

                                <Tooltip title="Editar">

                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            onEdit(matricula)
                                        }
                                    >

                                        <EditIcon />

                                    </IconButton>

                                </Tooltip>

                                <Tooltip title="Excluir">

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            onDelete(matricula)
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

        </TableContainer>

    );

}