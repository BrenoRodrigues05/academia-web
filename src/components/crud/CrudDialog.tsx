import type { ReactNode } from "react";

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    } from "@mui/material";
    import type { DialogProps } from "@mui/material";

    type Props = {
    open: boolean;
    title: string;
    loading?: boolean;
    maxWidth?: DialogProps["maxWidth"];
    submitLabel?: string;
    submitDisabled?: boolean;
    children: ReactNode;
    onClose(): void;
    };

    export default function CrudDialog({
    open,
    title,
    loading = false,
    maxWidth = "md",
    submitLabel = "Salvar",
    submitDisabled = false,
    children,
    onClose,
    }: Props) {
    return (
        <Dialog
        open={open}
        onClose={loading ? undefined : onClose}
        fullWidth
        maxWidth={maxWidth}
        slotProps={{
            paper: {
            sx: {
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundImage: "none",
            },
            },
        }}
        >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 22, py: 2.5 }}>
            {title}
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: "24px !important" }}>{children}</DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button color="inherit" disabled={loading} onClick={onClose}>
            Cancelar
            </Button>

            <Button
            type="submit"
            form="crud-form"
            variant="contained"
            disabled={loading || submitDisabled}
            sx={{ minWidth: 110, fontWeight: 800 }}
            >
            {loading ? <CircularProgress size={22} color="inherit" /> : submitLabel}
            </Button>
        </DialogActions>
        </Dialog>
    );
}