import {
  BlockOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { IconButton, Stack, Tooltip, alpha } from "@mui/material";
import type { ReactNode } from "react";

type ActionColor = "primary" | "warning" | "success" | "error";

type Props = {
    onEdit(): void;
    onDelete?(): void;
    onDeactivate?(): void;
    isAtivo?: boolean;
    };

    function ActionButton({
    title,
    color,
    onClick,
    children,
    }: {
    title: string;
    color: ActionColor;
    onClick(): void;
    children: ReactNode;
    }) {
    return (
        <Tooltip title={title}>
        <IconButton
            size="small"
            color={color}
            onClick={onClick}
            aria-label={title}
            sx={{
            borderRadius: 2,
            transition: "all .15s",
            "&:hover": {
                bgcolor: (t) => alpha(t.palette[color].main, 0.14),
                transform: "translateY(-1px)",
            },
            }}
        >
            {children}
        </IconButton>
        </Tooltip>
    );
    }

    export default function CrudActions({
    onEdit,
    onDelete,
    onDeactivate,
    isAtivo = true,
    }: Props) {
    return (
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
        {onDeactivate && (
            <ActionButton
            title={isAtivo ? "Desativar" : "Ativar"}
            color={isAtivo ? "warning" : "success"}
            onClick={onDeactivate}
            >
            {isAtivo ? <BlockOutlined /> : <CheckCircleOutlined />}
            </ActionButton>
        )}

        <ActionButton title="Editar" color="primary" onClick={onEdit}>
            <EditOutlined />
        </ActionButton>

        {onDelete && (
            <ActionButton title="Excluir" color="error" onClick={onDelete}>
            <DeleteOutlined />
            </ActionButton>
        )}
        </Stack>
    );
}