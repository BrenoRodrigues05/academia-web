import {
Grid,
} from "@mui/material";

import {
People,
FitnessCenter,
CreditCard,
SportsGymnastics,
} from "@mui/icons-material";

import DashboardCard from "./DashboardCard";

export default function DashboardStats() {

return (
<Grid container spacing={3}>
<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
<DashboardCard

title="Alunos"

value={0}

icon={<People color="primary" />}

/>

</Grid>

<Grid size={{ xs: 12, sm: 6, lg: 3 }}>

<DashboardCard

title="Planos"

value={0}

icon={<CreditCard color="success" />}

/>

</Grid>

<Grid size={{ xs: 12, sm: 6, lg: 3 }}>

<DashboardCard

title="Personais"

value={0}

icon={<SportsGymnastics color="warning" />}

/>

</Grid>

<Grid size={{ xs: 12, sm: 6, lg: 3 }}>

<DashboardCard

title="Treinos"

value={0}

icon={<FitnessCenter color="error" />}

/>

</Grid>

</Grid>

);

}