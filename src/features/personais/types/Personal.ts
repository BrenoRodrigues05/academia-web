import { Sexo } from "@/shared/enums/Sexo";

export interface Personal {

    id: number;

    nome: string;

    sobrenome: string;

    email: string;

    telefone: string;

    cref: string;

    especialidade: string;

    sexo: Sexo;

    ativo: boolean;

    usuario?: {

        id: number;
        ativo: boolean;
    }
}