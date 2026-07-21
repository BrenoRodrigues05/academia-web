import { useCrud } from "@/api/hooks/useCrud";
import PlanoService from "../api/PlanoService";
import useNotification from "@/hooks/useNotification";

export default function usePlanos() {
    const crud = useCrud(PlanoService);
    const { notification, showSuccess, showError, closeNotification } = useNotification();

    async function create(data: unknown) {
        try {
        await PlanoService.create(data);
        showSuccess("Plano cadastrado com sucesso!");
        await crud.reload();
        } catch (error) {
        showError("Erro ao cadastrar plano.");
        throw error;
        }
    }

    async function update(id: number, data: unknown) {
        try {
        await PlanoService.update(id, data);
        showSuccess("Plano atualizado com sucesso.");
        await crud.reload();
        } catch (error) {
        showError("Erro ao atualizar plano.");
        throw error;
        }
    }

    async function remove(id: number) {
        try {
        await PlanoService.delete(id);
        showSuccess("Plano removido com sucesso.");
        await crud.reload();
        } catch (error) {
        showError("Erro ao remover plano.");
        }
    }

    return {
        ...crud,
        create,
        update,
        remove,
        notification,
        closeNotification,
    };
}