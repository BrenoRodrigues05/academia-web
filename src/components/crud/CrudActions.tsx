import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

    import {
    IconButton,
    Stack,
    Tooltip,
    } from "@mui/material";

    type Props = {
    onEdit(): void;
    onDelete(): void;
    onDeactivate?(): void;
    isAtivo?: boolean; 
    };

export default function CrudActions({
    onEdit,
    onDelete,
    onDeactivate,
    isAtivo = true, 
    }: Props) {
    return (
    <Stack
        direction="row"
        sx={{ justifyContent: "center" }}
        spacing={1}
    >
        {onDeactivate && (
            <Tooltip title={isAtivo ? "Desativar" : "Ativar"}>
            <IconButton
                color={isAtivo ? "warning" : "success"} 
                onClick={onDeactivate}
            >
                {isAtivo ? <BlockIcon /> : <CheckCircleIcon />}
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