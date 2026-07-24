import { GrupoMuscular } from "@/shared/enums/GrupoMuscular";

export interface Exercicio {

    id: number;

    nome: string;

    grupoMuscular: GrupoMuscular

    descricao: string;

}