import { Sexo } from "@/shared/enums/Sexo";

export interface Aluno {

    id: number;

    nome: string;

    email: string;

    telefone: string;

    dataNascimento: string;

    sexo: Sexo;

    usuario?: {

        id: number;

        ativo: boolean;
    };
}