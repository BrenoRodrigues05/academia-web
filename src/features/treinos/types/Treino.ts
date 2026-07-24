import type { Aluno } from "@/features/alunos/types";
import type { Personal } from "@/features/personais/types";

import type { ItemTreino } from "./ItemTreino";

export interface Treino {

    id: number;

    nome: string;

    observacoes: string;

    ativo: boolean;

    dataInicio: string;

    dataFim: string | null;

    aluno: Aluno;

    nomeAluno: string;

    personal: Personal;

    nomePersonal: string;

    itens: ItemTreino[];

}