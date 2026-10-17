export interface PedidoCreateDTO {
    itens: {
        produtoId: number;
        quantidade: number;
    }[];
    metodoPagamento: 'PIX' | 'PAGAR_NA_RETIRADA';
}