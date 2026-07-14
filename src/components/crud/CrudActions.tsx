import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";

import {
    IconButton,
    Stack,
    Tooltip,
} from "@mui/material";

type Props = {

    onEdit(): void;

    onDelete(): void;

    onDeactivate?(): void;

};

export default function CrudActions({

    onEdit,

    onDelete,

    onDeactivate,

}: Props) {

    return (

        <Stack
            direction="row"
            sx={{ justifyContent: "center" }}
            spacing={1}
        >

            {onDeactivate && (
            <Tooltip title="Alterar Status do Aluno">
            <IconButton
            color="warning" 
            onClick={onDeactivate}
            >
            <BlockIcon />
            </IconButton>
        </Tooltip>
        )}

            <Tooltip title="Editar">

                <IconButton
                    color="primary"
                    onClick={onEdit}
                >

                    <EditIcon />

                </IconButton>

            </Tooltip>

            <Tooltip title="Excluir">

                <IconButton
                    color="error"
                    onClick={onDelete}
                >

                    <DeleteIcon />

                </IconButton>

            </Tooltip>
            
        </Stack>

    );

}