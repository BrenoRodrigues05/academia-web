import type {Aluno} from "@/features/alunos/types"
import type {Plano} from "@/features/planos/types"

export interface Matricula {

    matricula : number;

    ativa: boolean;

    planoId: number;
    
    pagamentoId: number;

    pixCopiaECola: string;

    qrCodeBase64: string;

    aluno: Aluno;

    plano: Plano;

}