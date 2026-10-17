import type { Produto } from "./produto";

export interface ItemCarrinho {
    produto: Produto;
    quantidade: number;
}

export type MetodoPagamentoLoja = 'PIX' | 'PAGAR_N_RETIRADA' | 'PAGAR_NA_RETIRADA';