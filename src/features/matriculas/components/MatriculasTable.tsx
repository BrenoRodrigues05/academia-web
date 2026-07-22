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
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import type { Matricula } from "../types";

interface MatriculasTableProps {
    matriculas: Matricula[];
    onEdit: (matricula: Matricula) => void;
    onToggleStatus: (matricula: Matricula) => void;
}

export default function MatriculasTable({
    matriculas,
    onEdit,
    onToggleStatus,
}: MatriculasTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={80}>ID</TableCell>
                        <TableCell>Aluno</TableCell>
                        <TableCell>Plano</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Ações</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {matriculas.map((matricula) => (
                        <TableRow key={matricula.matricula} hover>
                            <TableCell>{matricula.matricula}</TableCell>
                            <TableCell>{matricula.aluno?.nome ?? "—"}</TableCell>
                            <TableCell>{matricula.plano?.nome ?? "—"}</TableCell>

                            <TableCell align="center">
                                <Chip
                                    label={matricula.ativa ? "Ativa" : "Inativa"}
                                    color={matricula.ativa ? "success" : "default"}
                                    size="small"
                                />
                            </TableCell>

                            <TableCell align="center">
                                <Tooltip title="Editar">
                                    <IconButton
                                        color="primary"
                                        onClick={() => onEdit(matricula)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={matricula.ativa ? "Desativar" : "Ativar"}>
                                    <IconButton
                                        color={matricula.ativa ? "error" : "success"}
                                        onClick={() => onToggleStatus(matricula)}
                                    >
                                        {matricula.ativa ? (
                                            <BlockIcon />
                                        ) : (
                                            <CheckCircleIcon />
                                        )}
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