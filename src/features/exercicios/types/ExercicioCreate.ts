import { GrupoMuscular } from "@/shared/enums/GrupoMuscular";

export interface ExercicioCreate {

    nome: string;

    grupoMuscular: GrupoMuscular

    descricao: string;

}