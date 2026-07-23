import {
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";

import ItemTreinoForm from "./ItemTreinoForm";

import type { Exercicio } from "@/features/exercicios/types";
import type { ItemTreinoFormData } from "../validation/treinoSchema";

type Props = {
    open: boolean;
    exercicios: Exercicio[];
    initialData?: ItemTreinoFormData;
    onClose: () => void;
    onSubmit: (
        data: ItemTreinoFormData
    ) => void;
};

export default function ItemTreinoDialog({
    open,
    exercicios,
    initialData,
    onClose,
    onSubmit,
}: Props) {

    function handleSubmit(
        data: ItemTreinoFormData
    ) {
        onSubmit(data);
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

                {initialData

                    ? "Editar Exercício"

                    : "Adicionar Exercício"}

            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>

                <ItemTreinoForm

                    exercicios={exercicios}

                    initialData={initialData}

                    onSubmit={handleSubmit}

                />

            </DialogContent>

        </Dialog>

    );

}