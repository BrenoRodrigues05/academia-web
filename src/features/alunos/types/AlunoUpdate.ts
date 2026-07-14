export interface AlunoUpdate {

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