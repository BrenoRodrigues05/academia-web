import BaseCrudService from "@/api/BaseCrudService";
import type { Plano } from "../types/Plano";

class PlanoService extends BaseCrudService<Plano> {
    constructor() {
        super("/planos");
    }
}

export default new PlanoService();