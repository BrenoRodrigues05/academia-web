import { useCrud } from "@/api/hooks/useCrud";

import AlunoService from "../services/AlunoService";

export default function useAlunos() {

    return useCrud(AlunoService);

}