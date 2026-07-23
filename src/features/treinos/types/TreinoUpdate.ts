import type { ItemTreinoCreate } from "./ItemTreinoCreate";

export interface TreinoUpdate {

    nome: string;

    observacoes: string;

    dataInicio: string;

    dataFim: string;

    itens: ItemTreinoCreate[];

}