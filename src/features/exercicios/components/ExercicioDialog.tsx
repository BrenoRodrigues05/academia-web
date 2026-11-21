import CrudDialog from "@/components/crud/CrudDialog";

import ExercicioForm from "./ExercicioForm";

import type { Exercicio } from "../types";
import type { ExercicioFormData } from "../validation/exercicioSchema";

type Props = {
    open: boolean;
    exercicio?: Exercicio | null;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (data: ExercicioFormData) => Promise<void>;
    };

    export default function ExercicioDialog({
    open,
    exercicio,
    loading = false,
    onClose,
    onSubmit,
    }: Props) {
    return (
        <CrudDialog
        open={open}
        title={exercicio ? "Editar Exercício" : "Novo Exercício"}
        loading={loading}
        maxWidth="sm"
        onClose={onClose}
        >
        <ExercicioForm exercicio={exercicio} onSubmit={onSubmit} />
        </CrudDialog>
    );
}