import {
Grid,
} from "@mui/material";

import {
People,
FitnessCenter,
CreditCard,
SportsGymnastics,
} from "@mui/icons-material";
import { useCrud } from "@/api/hooks/useCrud";
import alunoService from "@/features/alunos/services/AlunoService";
import PlanoService from "@/features/planos/api/PlanoService";
import PersonalService from "@/features/personais/api/PersonalService";
import TreinoService from "@/features/treinos/api/TreinoService";

import DashboardCard from "./DashboardCard";

export default function DashboardStats() {
    const { count: totalAlunos } = useCrud(alunoService, true);
    const { count: totalPlanos } = useCrud(PlanoService, true);
    const { count: totalPersonais } = useCrud(PersonalService, true);
    const { count: totalTreinos } = useCrud(TreinoService, true);

return (
<Grid container spacing={3}>
<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
<DashboardCard

title="Alunos"
value={totalAlunos}

icon={<People color="primary" />}

/>

</Grid>

<Grid size={{ xs: 12, sm: 6, lg: 3 }}>

<DashboardCard

title="Planos"

value={totalPlanos}

icon={<CreditCard color="success" />}

/>

</Grid>

<Grid size={{ xs: 12, sm: 6, lg: 3 }}>

<DashboardCard

title="Personais"

value={totalPersonais}

icon={<SportsGymnastics color="warning" />}

/>

</Grid>

<Grid size={{ xs: 12, sm: 6, lg: 3 }}>

<DashboardCard

title="Treinos"

value={totalTreinos}

icon={<FitnessCenter color="error" />}

/>

</Grid>

</Grid>

);

}