import CrudDialog from "@/components/crud/CrudDialog";
import ProdutoForm from "./ProdutoForm";
import type { Produto } from "../types";
import type { ProdutoFormData } from "../validation/produtoSchema";

type Props = {
    open: boolean;
    produto?: Produto;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (data: ProdutoFormData) => Promise<void>;
    };

    export default function ProdutoDialog({
    open,
    produto,
    loading = false,
    onClose,
    onSubmit,
    }: Props) {
    return (
        <CrudDialog
        open={open}
        title={produto ? "Editar Produto" : "Novo Produto"}
        loading={loading}
        maxWidth="sm"
        onClose={onClose}
        >
        <ProdutoForm initialData={produto} onSubmit={onSubmit} />
        </CrudDialog>
    );
}