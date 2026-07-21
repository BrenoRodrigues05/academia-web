import BaseCrudService from "@/api/BaseCrudService";
import api from "@/api/axios";
import AlunoService from "@/features/alunos/services/AlunoService";
import PlanoService from "@/features/planos/api/PlanoService";
import type {Matricula} from "../types";

    class MatriculaService
    extends BaseCrudService<Matricula>{

        constructor(){
            super("/matriculas");
        }

        async loadReferenceData() {

        const [alunos, planos] =
        await Promise.all([
            AlunoService.findAll(),
            PlanoService.findAll(),
        ]);
        return {
            alunos: alunos.content,
            planos: planos.content,
        };
}

    async getAlunos(){
    return AlunoService.findAll();
    }

    async getPlanos(){
    return PlanoService.findAll();
    }

    async findByAluno(id:number){
    const response= await api.get(`${this.endpoint}/aluno/${id}`);
    return response.data;
    }

    async findByPlano(id:number){
    const response= await api.get(`${this.endpoint}/plano/${id}`);
    return response.data;
    }

    async findAtivas(){
    const response= await api.get(`${this.endpoint}/ativas`);
    return response.data;
}
}
export default new MatriculaService();