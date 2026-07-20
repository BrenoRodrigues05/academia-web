import type { TipoPlano } from "@/shared/enums/TipoPlano";

export interface PlanoCreate {
    nome: string;
    descricao: string;
    valor: number;
    TipoPlano : TipoPlano;
    imagemURL : string;       
}