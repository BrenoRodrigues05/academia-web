import {
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";

import ExercicioForm from "./ExercicioForm";

import type { Exercicio } from "../types";
import type { ExercicioFormData } from "../validation/exercicioSchema";

type Props = {
    open: boolean;
    exercicio?: Exercicio | null;
    onClose: () => void;
    onSubmit: (data: ExercicioFormData) => Promise<void>;
};

export default function ExercicioDialog({
    open,
    exercicio,
    onClose,
    onSubmit,
}: Props) {

    async function handleSubmit(data: ExercicioFormData) {
        await onSubmit(data);
        onClose();
    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                {exercicio
                    ? "Editar Exercício"
                    : "Novo Exercício"}

            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>

                <ExercicioForm

                    exercicio={exercicio}

                    onSubmit={handleSubmit}

                />

            </DialogContent>

        </Dialog>

    );

}