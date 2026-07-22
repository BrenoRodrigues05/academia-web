import type {Aluno} from "@/features/alunos/types"
import type {Plano} from "@/features/planos/types"

export interface Matricula {

    matricula : number;

    ativa: boolean;

    aluno: Aluno;

    plano: Plano;

}