import BaseCrudService from "@/api/BaseCrudService";
import api from "@/api/axios";

import type { Treino } from "../types";

class TreinoService extends BaseCrudService<Treino> {

    constructor() {
        super("/treinos");
    }

    async findByNome(nome: string): Promise<Treino[]> {

        const response = await api.get<Treino[]>(
            `${this.endpoint}/busca-nome`,
            {
                params: { nome }
            }
        );

        return response.data;
    }

    async findByAluno(alunoId: number): Promise<Treino> {

        const response = await api.get<Treino>(
            `${this.endpoint}/aluno/${alunoId}`
        );

        return response.data;
    }

    async findByPersonal(personalId: number): Promise<Treino[]> {

        const response = await api.get<Treino[]>(
            `${this.endpoint}/personal/${personalId}`
        );

        return response.data;
    }

    async findAtivos(): Promise<Treino[]> {

        const response = await api.get<Treino[]>(
            `${this.endpoint}/ativos`
        );

        return response.data;
    }

    async findInativos(): Promise<Treino[]> {

        const response = await api.get<Treino[]>(
            `${this.endpoint}/inativos`
        );

        return response.data;
    }

    async meuTreino(): Promise<Treino> {

        const response = await api.get<Treino>(
            `${this.endpoint}/me`
        );

        return response.data;
    }

    async meuHistorico(): Promise<Treino[]> {

        const response = await api.get<Treino[]>(
            `${this.endpoint}/me/historico`
        );

        return response.data;
    }

    async historicoAluno(alunoId: number): Promise<Treino[]> {

        const response = await api.get<Treino[]>(
            `${this.endpoint}/aluno/${alunoId}/historico`
        );

        return response.data;
    }

    async alterarStatus(
        id: number,
        ativo: boolean
    ): Promise<Treino> {

        const response = await api.patch<Treino>(
            `${this.endpoint}/${id}/status`,
            null,
            {
                params: { ativo }
            }
        );

        return response.data;
    }

}

export default new TreinoService();