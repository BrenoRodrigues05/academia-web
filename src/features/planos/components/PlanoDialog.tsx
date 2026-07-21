import { CrudDialog } from "@/components/crud";
import PlanoForm from "./PlanoForm";
import type { PlanoSchema } from "../validation/planoSchema";
import type { Plano } from "../types";

type Props = {
    open: boolean;
    loading?: boolean,
    onClose(): void;
    onSubmit(data: PlanoSchema): Promise<void>;
    title: string;
    plano?: Plano | null;
};

export default function PlanoDialog({
    open,
    loading,
    onClose,
    onSubmit,
    title,
    plano,
}: Props) {
        return (
        <CrudDialog
            open={open}
            title={title}
            loading={loading}
            onClose={onClose}
        >
            <PlanoForm
                onSubmit={onSubmit}
                defaultValues={plano || undefined}
            />
        </CrudDialog>
    );
}