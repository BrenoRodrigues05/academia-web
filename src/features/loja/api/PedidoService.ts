import api from "@/api/axios";
import type { PedidoCreateDTO, PedidoResponse } from "../types";

class PedidoService {
    private endpoint = "/pedidos";

    async criarPedido(dto: PedidoCreateDTO): Promise<PedidoResponse> {
        const response = await api.post<PedidoResponse>(this.endpoint, dto);
        return response.data;
    }

    async listarMeusPedidos(): Promise<PedidoResponse[]> {
        const response = await api.get<PedidoResponse[]>(`${this.endpoint}/meus-pedidos`);
        return response.data;
    }
}

export default new PedidoService();