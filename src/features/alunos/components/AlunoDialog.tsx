import CrudDialog from "@/components/crud/CrudDialog";

import AlunoForm from "./AlunoForm";

import type { AlunoSchema } from "../validation/alunoSchema";
import type { Aluno } from "../types/Aluno";

type Props = {

    open: boolean;

    loading?: boolean;

    onClose(): void;

    onSubmit(data: AlunoSchema): Promise<void>;

    title: string;         
    aluno?: Aluno | null;

};

export default function AlunoDialog({

    open,

    loading,

    onClose,

    onSubmit,

    title,             
    aluno,

}: Props) {

    return (

        <CrudDialog

            open={open}

            title={title}

            loading={loading}

            onClose={onClose}

        >

            <AlunoForm

                onSubmit={onSubmit}
                defaultValues={aluno || undefined}

            />

        </CrudDialog>

    );

}