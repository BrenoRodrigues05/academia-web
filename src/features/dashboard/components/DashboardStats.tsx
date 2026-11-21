import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
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
    import { useAuth } from "@/features/auth/hooks/useAuth";
    import { UserRole } from "@/shared/enums/UserRole";

    import DashboardCard from "./DashboardCard";

    export default function DashboardStats() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAluno = user?.role === UserRole.ALUNO;

    const { count: totalAlunos } = useCrud(alunoService, !isAluno);
    const { count: totalPlanos } = useCrud(PlanoService, !isAluno);
    const { count: totalPersonais } = useCrud(PersonalService, !isAluno);
    const { count: totalTreinos } = useCrud(TreinoService, !isAluno);

    if (isAluno) {
        return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
            <DashboardCard
                title="Meus Treinos"
                color="primary"
                icon={<FitnessCenter />}
                buttonText="Acessar treinos"
                onClick={() => navigate("/treinos")}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <DashboardCard
                title="Meu Plano"
                color="success"
                icon={<CreditCard />}
                buttonText="Ver plano ativo"
                onClick={() => navigate("/planos")}
            />
            </Grid>
        </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardCard
            title="Alunos"
            value={totalAlunos}
            color="primary"
            icon={<People />}
            />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardCard
            title="Planos"
            value={totalPlanos}
            color="success"
            icon={<CreditCard />}
            />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardCard
            title="Personais"
            value={totalPersonais}
            color="warning"
            icon={<SportsGymnastics />}
            />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardCard
            title="Treinos"
            value={totalTreinos}
            color="error"
            icon={<FitnessCenter />}
            />
        </Grid>
        </Grid>
    );
}