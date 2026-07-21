import { useCrud } from "@/api/hooks/useCrud";
import { useState } from "react";

import MatriculaService from "../api/MatriculaService";

import type {
    Matricula,
    MatriculaCreate,
    MatriculaUpdate,
} from "../types";

import type { Aluno } from "@/features/alunos/types";
import type { Plano } from "@/features/planos/types";

import useNotification from "@/hooks/useNotification";

export default function useMatriculas() {

    const crud = useCrud<Matricula>(MatriculaService);

    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [loadingLists, setLoadingLists] = useState(false);

    const {
        notification,
        showSuccess,
        showError,
        closeNotification,
    } = useNotification();

    async function loadReferenceData() {

        if (alunos.length > 0 && planos.length > 0) {
            return;
        }

        setLoadingLists(true);

        try {
            const data =
                await MatriculaService.loadReferenceData();
            setAlunos(data.alunos);
            setPlanos(data.planos);
        } catch {
            showError(
                "Erro ao carregar alunos e planos."
            );
        } finally {
            setLoadingLists(false);
        }
    }

    async function create(data: MatriculaCreate) {
        try {
            await MatriculaService.create(data);
            showSuccess(
                "Matrícula cadastrada com sucesso!"
            );
            await crud.reload();
        } catch (error) {
            showError(
                "Erro ao cadastrar matrícula."
            );
            throw error;
        }
    }

    async function update(
        id: number,
        data: MatriculaUpdate
    ) {

        try {
            await MatriculaService.update(id, data);
            showSuccess(
                "Matrícula atualizada com sucesso!"
            );
            await crud.reload();
        } catch (error) {
            showError(
                "Erro ao atualizar matrícula."
            );
            throw error;
        }
    }

    async function remove(id: number) {
        try {
            await MatriculaService.delete(id);
            showSuccess(
                "Matrícula removida com sucesso!"
            );
            await crud.reload();
        } catch {
            showError(
                "Erro ao remover matrícula."
            );
        }

    }
    return {
        ...crud,
        alunos,
        planos,
        loadingLists,
        loadReferenceData,
        create,
        update,
        remove,
        notification,
        closeNotification,
    };
}