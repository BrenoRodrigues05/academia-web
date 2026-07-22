import { useState } from "react";
import { useCrud } from "@/api/hooks/useCrud";

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
        const data = await MatriculaService.loadReferenceData();
        setAlunos(data.alunos);
        setPlanos(data.planos);
        } catch {
        showError("Erro ao carregar alunos e planos.");
        } finally {
        setLoadingLists(false);
        }
    }

    async function create(data: MatriculaCreate) {
        try {
        await MatriculaService.create(data);
        showSuccess("Matrícula cadastrada com sucesso!");
        await crud.reload();
        } catch (error) {
        showError("Erro ao cadastrar matrícula.");
        throw error;
        }
    }

    async function update(idMatricula: number, data: MatriculaUpdate) {
        try {
        await MatriculaService.editarPlano(idMatricula, data.planoId);
        showSuccess("Plano da matrícula atualizado com sucesso!");
        await crud.reload();
        } catch (error) {
        showError("Erro ao atualizar o plano da matrícula.");
        throw error;
        }
    }

    async function toggleStatus(matricula: Matricula) {
        const novoStatus = !matricula.ativa;
        const acaoText = novoStatus ? "ativada" : "desativada";

        try {
        await MatriculaService.alterarStatus(matricula.matricula, novoStatus);
        showSuccess(`Matrícula ${acaoText} com sucesso!`);
        await crud.reload();
        } catch {
        showError(`Erro ao ${novoStatus ? "ativar" : "desativar"} matrícula.`);
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
        toggleStatus,
        notification,
        closeNotification,
    };
}