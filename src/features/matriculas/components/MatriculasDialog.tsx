import CrudDialog from "@/components/crud/CrudDialog";

import MatriculaForm from "./MatriculaForm";

import type { Aluno } from "@/features/alunos/types";
import type { Plano } from "@/features/planos/types";

import type { Matricula, MatriculaCreate } from "../types";

import type { MatriculaFormData } from "../validation/matriculasSchema";

interface MatriculasDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: MatriculaFormData) => Promise<void>;
    alunos: Aluno[];
    planos: Plano[];
    matriculas?: Matricula[];
    loading: boolean;
    matricula?: Matricula;
    }

    export default function MatriculasDialog({
    open,
    onClose,
    onSubmit,
    alunos,
    planos,
    matriculas = [],
    loading,
    matricula,
    }: MatriculasDialogProps) {
    const isEditMode = Boolean(matricula);
    const isMatriculaInativa = isEditMode && matricula?.ativa === false;

    const defaultValues: Partial<MatriculaCreate> | undefined = matricula
        ? {
            alunoId:
            typeof matricula.aluno === "object"
                ? matricula.aluno?.id
                : matricula.aluno,
            planoId:
            typeof matricula.plano === "object"
                ? matricula.plano?.id
                : matricula.plano,
            ativa: matricula.ativa,
        }
        : undefined;

    return (
        <CrudDialog
        open={open}
        title={matricula ? "Editar Matrícula" : "Nova Matrícula"}
        loading={loading}
        maxWidth="sm"
        submitLabel={matricula ? "Salvar alterações" : "Gerar pagamento Pix"}
        submitDisabled={isMatriculaInativa}
        onClose={onClose}
        >
        <MatriculaForm
            defaultValues={defaultValues}
            alunos={alunos}
            planos={planos}
            matriculas={matriculas}
            loading={loading}
            isEditMode={isEditMode}
            onSubmit={onSubmit}
        />
        </CrudDialog>
    );
}