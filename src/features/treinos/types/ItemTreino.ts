import type { Exercicio } from "@/features/exercicios/types";

export interface ItemTreino {

    id: number;

    series: number;

    repeticoes: number;

    descansoSegundos: number;

    exercicio: Exercicio;

}