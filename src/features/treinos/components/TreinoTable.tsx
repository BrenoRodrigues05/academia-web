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
import AutorenewIcon from "@mui/icons-material/Autorenew";

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
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Aluno</TableCell>
                        <TableCell>Personal</TableCell>
                        <TableCell>Início</TableCell>
                        <TableCell>Fim</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Ações</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((treino) => (
                        <TableRow key={treino.id} hover>
                            <TableCell>{treino.nome}</TableCell>
                            
                            <TableCell>{treino.nomeAluno ?? "-"}</TableCell>
                            <TableCell>{treino.nomePersonal ?? "-"}</TableCell>

                            <TableCell>{treino.dataInicio ?? "-"}</TableCell>
                            <TableCell>{treino.dataFim ?? "-"}</TableCell>

                            <TableCell>
                                <Chip
                                    label={treino.ativo ? "Ativo" : "Inativo"}
                                    color={treino.ativo ? "success" : "default"}
                                    size="small"
                                />
                            </TableCell>

                            <TableCell align="center">
                                <Tooltip title="Editar">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => onEdit(treino)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                {onStatus && (
                                    <Tooltip title="Alterar Status">
                                        <IconButton
                                            color="warning"
                                            size="small"
                                            onClick={() => onStatus(treino)}
                                        >
                                            <AutorenewIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}

                                <Tooltip title="Excluir">
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => onDelete(treino)}
                                    >
                                        <DeleteIcon fontSize="small" />
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