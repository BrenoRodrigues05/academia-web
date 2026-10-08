import type { Sexo } from "@/shared/enums/Sexo";

export interface RegisterAlunoData {
    login: string;
    senha: string;
    nome: string;
    email: string;
    dataNascimento: string; 
    telefone: string;
    sexo: Sexo | string;
    planoId: number;
    }

    export interface RegisterPixResponse {
    matricula: number;
    alunoId: number;
    planoId: number;
    ativa: boolean;
    pagamentoId: number;
    pixCopiaECola: string;
    qrCodeBase64: string;
}