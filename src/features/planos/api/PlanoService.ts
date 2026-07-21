import BaseCrudService from "@/api/BaseCrudService";
import type {Plano} from "../types/Plano";
import { TipoPlano } from "@/shared/enums/TipoPlano";
import api from "@/api/axios";

class PlanoService extends BaseCrudService<Plano>{

    constructor(){
        super("/planos");
    }

    async findByNome(nome:string): Promise<Plano[]>{
        const response = await api.get<Plano[]>(`${this.endpoint}/busca-nome`,{
            params: {nome}
        });
        return response.data;
    }

    async findByValor(valor:number): Promise<Plano[]>{
        const response = await api.get<Plano[]>(`${this.endpoint}/busca-valor`,{
            params: {valor}
        });
        return response.data;
    }

    async findByDescricao(descricao:string): Promise<Plano[]>{
        const response = await api.get<Plano[]>(`${this.endpoint}/busca-descricao`,{
            params: {descricao}
        });
        return response.data;
    }

    async findByTipo(tipo:TipoPlano): Promise<Plano[]>{
        const response = await api.get<Plano[]>(`${this.endpoint}/busca-tipo`,{
            params: {tipo}
        });
        return response.data;
    }
}

export default new PlanoService();