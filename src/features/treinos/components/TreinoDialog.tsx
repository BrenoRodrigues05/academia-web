import {
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";

import TreinoForm from "./TreinoForm";

import type { Treino } from "../types";
import type { Aluno } from "@/features/alunos/types";
import type { Personal } from "@/features/personais/types";
import type { Exercicio } from "@/features/exercicios/types";
import type { TreinoFormData } from "../validation/treinoSchema";

type Props = {
    open: boolean;
    treino?: Treino;
    alunos: Aluno[];
    personais: Personal[];
    isAdminOrSuperAdmin?: boolean;
    exercicios: Exercicio[];
    currentPersonalId: number; 
    onClose: () => void;
    onSubmit: (data: TreinoFormData) => Promise<void>;
};

export default function TreinoDialog({
    open,
    treino,
    alunos,
    exercicios,
    personais=[],
    currentPersonalId,
    isAdminOrSuperAdmin = false,
    onClose,
    onSubmit,
}: Props) {
    async function handleSubmit(data: TreinoFormData) {
        await onSubmit(data);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>
                {treino ? "Editar Treino" : "Novo Treino"}
            </DialogTitle>

            <DialogContent>
                <TreinoForm
                    alunos={alunos}
                    exercicios={exercicios}
                    personais={personais}
                    currentPersonalId={currentPersonalId}
                    isAdminOrSuperAdmin={isAdminOrSuperAdmin}
                    initialData={treino}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}