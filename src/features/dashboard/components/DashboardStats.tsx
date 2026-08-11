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
            <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
            <DashboardCard
                title="Meus Treinos"
                icon={<FitnessCenter color="primary" fontSize="medium" />}
                buttonText="Acessar Treinos"
                onClick={() => navigate("/treinos")}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
            <DashboardCard
                title="Meu Plano"
                icon={<CreditCard color="success" fontSize="medium" />}
                buttonText="Ver Plano Ativo"
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