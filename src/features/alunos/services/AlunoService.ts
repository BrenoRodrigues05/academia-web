import BaseCrudService from "@/api/BaseCrudService";

import type { Aluno, } from "../types/Aluno";
import api from "@/api/axios";

class AlunoService
extends BaseCrudService<Aluno> {

    constructor() {

        super("/alunos");

    }

    async findByNome(nome: string): Promise<Aluno[]> {
    const response = await api.get<Aluno[]>(`${this.endpoint}/busca-nome`, {
        params: { nome }
        });
        return response.data;
    }

    async findByEmail(email: string): Promise<Aluno[]> {
        const response = await api.get<Aluno[]>(`${this.endpoint}/busca-email`, {
            params: { email }
        });
        return response.data;
    }
}

export default new AlunoService();