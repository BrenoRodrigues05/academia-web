import BaseCrudService from "@/api/BaseCrudService";
import api from "@/api/axios";
import type { Produto } from "../types";

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

class ProdutoService extends BaseCrudService<Produto> {
    constructor() {
        super("/produtos");
    }

    async listarPaginado(page: number = 0, size: number = 10): Promise<PageResponse<Produto>> {
        const response = await api.get<PageResponse<Produto>>(this.endpoint, {
            params: { page, size }
        });
        return response.data;
    }

    async findByNome(nome: string): Promise<Produto> {
        const response = await api.get<Produto>(
            `${this.endpoint}/busca-nome`,
            {
                params: { nome }
            }
        );
        return response.data;
    }
}

export default new ProdutoService();