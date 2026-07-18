import { Sexo } from "@/shared/enums/Sexo";

export interface AlunoUpdate {

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