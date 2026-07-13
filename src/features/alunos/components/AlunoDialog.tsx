import CrudDialog from "@/components/crud/CrudDialog";

import AlunoForm from "./AlunoForm";

import type { AlunoSchema } from "../validation/alunoSchema";

type Props = {

    open: boolean;

    loading?: boolean;

    onClose(): void;

    onSubmit(data: AlunoSchema): Promise<void>;

};

export default function AlunoDialog({

    open,

    loading,

    onClose,

    onSubmit,

}: Props) {

    return (

        <CrudDialog

            open={open}

            title="Aluno"

            loading={loading}

            onClose={onClose}

        >

            <AlunoForm

                onSubmit={onSubmit}

            />

        </CrudDialog>

    );

}