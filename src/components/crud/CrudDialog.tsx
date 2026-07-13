import type { ReactNode } from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

type Props = {

    open: boolean;

    title: string;

    loading?: boolean;

    children: ReactNode;

    onClose(): void;

};

export default function CrudDialog({

    open,

    title,

    loading = false,

    children,

    onClose,

}: Props) {

    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                {title}

            </DialogTitle>

            <DialogContent>

                {children}

            </DialogContent>

            <DialogActions>

                <Button

                    disabled={loading}

                    onClick={onClose}

                >

                    Cancelar

                </Button>

                <Button

                    type="submit"

                    form="crud-form"

                    variant="contained"

                    disabled={loading}

                >

                    Salvar

                </Button>

            </DialogActions>

        </Dialog>

    );

}