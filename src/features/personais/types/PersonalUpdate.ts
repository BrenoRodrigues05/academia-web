import { Sexo } from "@/shared/enums/Sexo";

export interface PersonalUpdate {

    id: number;

    nome: string;

    sobrenome: string;

    email: string;

    telefone: string;

    cref: string;

    especialidade: string;

    sexo: Sexo;

}