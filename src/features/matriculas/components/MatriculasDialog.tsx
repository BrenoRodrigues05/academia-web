import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";

import MatriculaForm from "./MatriculaForm";

import type { Aluno } from "@/features/alunos/types";
import type { Plano } from "@/features/planos/types";

import type {
    Matricula,
    MatriculaCreate,
} from "../types";

import type {MatriculaFormData} from "../validation/matriculasSchema";

interface MatriculasDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: MatriculaFormData) => Promise<void>;
    alunos: Aluno[];
    planos: Plano[];
    loading: boolean;
    matricula?: Matricula;
}

export default function MatriculasDialog({
    open,
    onClose,
    onSubmit,
    alunos,
    planos,
    loading,
    matricula,
}: MatriculasDialogProps) {

    const defaultValues: Partial<MatriculaCreate> | undefined =
        matricula
            ? {
                    alunoId: matricula.aluno.id,
                    planoId: matricula.plano.id,
                    ativa: matricula.ativa,
                }
            : undefined;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                {matricula
                    ? "Editar Matrícula"
                    : "Nova Matrícula"}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <MatriculaForm
                    defaultValues={defaultValues}
                    alunos={alunos}
                    planos={planos}
                    loading={loading}
                    onSubmit={onSubmit}
                />

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancelar
                </Button>

            </DialogActions>
        </Dialog>
    );
}