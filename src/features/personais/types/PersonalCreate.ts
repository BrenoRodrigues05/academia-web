import { Sexo } from "@/shared/enums/Sexo";

export interface PersonalCreate {

    id: number;

    nome: string;

    sobrenome: string;

    email: string;

    telefone: string;

    cref: string;

    especialidade: string;

    ativo: boolean;

    sexo: Sexo;
}