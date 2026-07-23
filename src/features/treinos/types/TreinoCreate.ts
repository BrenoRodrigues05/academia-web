import type { ItemTreinoCreate } from "./ItemTreinoCreate";

export interface TreinoCreate {

    nome: string;

    observacoes: string;

    alunoId: number;

    dataInicio: string;

    dataFim: string;

    itens: ItemTreinoCreate[];

}