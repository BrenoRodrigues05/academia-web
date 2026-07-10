import BaseCrudService from "@/api/BaseCrudService";

import type {

    Aluno,

} from "../types/Aluno";

class AlunoService
extends BaseCrudService<Aluno> {

    constructor() {

        super("/alunos");

    }

}

export default new AlunoService();