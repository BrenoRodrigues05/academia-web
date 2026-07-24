import BaseCrudService from "@/api/BaseCrudService";
import api from "@/api/axios";

import type { Exercicio } from "../types";

class ExercicioService extends BaseCrudService<Exercicio> {

    constructor() {
        super("/exercicios");
    }

    async findByNome(nome: string): Promise<Exercicio[]> {

        const response = await api.get<Exercicio[]>(
            `${this.endpoint}/busca-nome`,
            {
                params: { nome }
            }
        );

        return response.data;
    }

}

export default new ExercicioService();