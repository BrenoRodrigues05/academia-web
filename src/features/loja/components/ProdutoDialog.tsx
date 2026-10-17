import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import ProdutoForm from "./ProdutoForm";
import type { Produto } from "../types";
import type { ProdutoFormData } from "../validation/produtoSchema";

type Props = {
    open: boolean;
    produto?: Produto;
    onClose: () => void;
    onSubmit: (data: ProdutoFormData) => Promise<void>;
};

export default function ProdutoDialog({
    open,
    produto,
    onClose,
    onSubmit,
}: Props) {
    async function handleFormSubmit(data: ProdutoFormData) {
        await onSubmit(data);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {produto ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogContent>
                <ProdutoForm
                    initialData={produto}
                    onSubmit={handleFormSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}