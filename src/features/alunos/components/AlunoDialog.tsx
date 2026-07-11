import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import type { AlunoSchema } from "../validation/alunoSchema";

import AlunoForm from "./AlunoForm";

type Props = {

    open: boolean;

    loading?: boolean;

    title: string;

    defaultValues?: Partial<AlunoSchema>;

    onClose: () => void;

    onSubmit: (data: AlunoSchema) => Promise<void>;

};

export default function AlunoDialog({

    open,

    loading = false,

    title,

    defaultValues,

    onClose,

    onSubmit,

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

                <AlunoForm

                    defaultValues={defaultValues}

                    onSubmit={onSubmit}

                />

            </DialogContent>

            <DialogActions>

                <Button
                    disabled={loading}
                    onClick={onClose}
                >

                    Cancelar

                </Button>

                <Button

                    form="aluno-form"

                    type="submit"

                    variant="contained"

                    disabled={loading}

                >

                    Salvar

                </Button>

            </DialogActions>

        </Dialog>

    );

}