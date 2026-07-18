import CrudDialog from "@/components/crud/CrudDialog";
import PersonalForm from "./PersonalForm.tsx"
import type { PersonalSchema } from "../validation/personalSchema";
import type { Personal } from "../types/Personal"; 

type Props = {
    open: boolean;
    loading?: boolean;
    onClose(): void;
    onSubmit(data: PersonalSchema): Promise<void>;
    title: string;         
    personal?: Personal | null;
};

export default function PersonalDialog({
    open,
    loading,
    onClose,
    onSubmit,
    title,             
    personal,
}: Props) {
    return (
        <CrudDialog
            open={open}
            title={title}
            loading={loading}
            onClose={onClose}
        >
            <PersonalForm
                onSubmit={onSubmit}
                defaultValues={personal || undefined}
            />
        </CrudDialog>
    );
}