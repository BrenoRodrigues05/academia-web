import type { TipoPlano } from "@/shared/enums/TipoPlano";

export interface Plano{
    id: number;
    nome: string;
    descricao: string;
    valor: number;
    tipo: TipoPlano;
    imagemURL : string;
}