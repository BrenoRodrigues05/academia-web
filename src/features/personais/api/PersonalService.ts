import BaseCrudService from "@/api/BaseCrudService";

import type { Personal } from "../types/Personal";
import api from "@/api/axios";

class PersonalService
extends BaseCrudService<Personal>{

    constructor(){

        super("/personais");
    }

    async findByNome(nome : string) : Promise<Personal[]>{
        const response = await api.get<Personal[]>(`${this.endpoint}/busca-nome`,{
            params: {nome}
        });
        return response.data;
    }

    async findByEmail(email: string) : Promise<Personal[]>{
        const response = await api.get<Personal[]>(`${this.endpoint}/busca-email`,{
            params: {email}
        });
        return response.data;
    }

    async findByCref(cref : string) : Promise<Personal[]>{
        const response = await api.get<Personal[]>(`${this.endpoint}/busca-cref`,{
            params: {cref}
        });
        return response.data;
    }

    async findByAtivoTrue(ativo : boolean) : Promise<Personal[]>{
        const response = await api.get<Personal[]>(`${this.endpoint}/ativos`,{
            params: {ativo}
        });
        return response.data;
    }

    async findByAtivoFalse(ativo : boolean) : Promise<Personal[]>{
        const response = await api.get<Personal[]>(`${this.endpoint}/inativos`,{
            params: {ativo}
        });
        return response.data;
    }
}

export default new PersonalService();