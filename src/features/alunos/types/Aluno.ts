export interface Aluno {

    id: number;

    nome: string;

    email: string;

    telefone: string;

    dataNascimento: string;

    sexo: string;

    usuario?: {

        id: number;

        ativo: boolean;
    };
}