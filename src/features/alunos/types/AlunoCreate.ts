import { Sexo } from "@/shared/enums/Sexo";

export interface AlunoCreate {

    nome: string;

    email: string;

    telefone: string;

    dataNascimento: string;

    sexo: Sexo;

}