import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Stack,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { ItemTreinoFormData } from "../validation/treinoSchema";
import type { Exercicio } from "@/features/exercicios/types";

export interface ItemTreinoTableData
    extends ItemTreinoFormData {

    exercicio: Exercicio;

}

type Props = {
    itens: ItemTreinoTableData[];
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
};

export default function ItemTreinoTable({
    itens,
    onEdit,
    onDelete,
}: Props) {

    if (!itens.length) {

        return (

            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    textAlign: "center",
                }}
            >

                <Typography color="text.secondary">

                    Nenhum exercício adicionado.

                </Typography>

            </Paper>

        );

    }

    return (

        <TableContainer
            component={Paper}
            variant="outlined"
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>

                            Exercício

                        </TableCell>

                        <TableCell align="center">

                            Séries

                        </TableCell>

                        <TableCell align="center">

                            Repetições

                        </TableCell>

                        <TableCell align="center">

                            Descanso

                        </TableCell>

                        <TableCell align="center">

                            Ações

                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {itens.map((item, index) => (

                        <TableRow
                            key={`${item.exercicioId}-${index}`}
                        >

                            <TableCell>

                                <Stack>

                                    <Typography sx={{ fontWeight: 600 }}>
                                        {item.exercicio.nome}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >

                                        {item.exercicio.grupoMuscular}

                                    </Typography>

                                </Stack>

                            </TableCell>

                            <TableCell align="center">

                                {item.series}

                            </TableCell>

                            <TableCell align="center">

                                {item.repeticoes}

                            </TableCell>

                            <TableCell align="center">

                                {item.descansoSegundos}s

                            </TableCell>

                            <TableCell align="center">

                                <Tooltip title="Editar">

                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            onEdit(index)
                                        }
                                    >

                                        <EditIcon />

                                    </IconButton>

                                </Tooltip>

                                <Tooltip title="Remover">

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            onDelete(index)
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