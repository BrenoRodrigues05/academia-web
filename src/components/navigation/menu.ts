import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserRole } from "@/shared/enums/UserRole";

export interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
  },
  {
    label: "Alunos",
    path: "/alunos",
    icon: SchoolIcon,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PERSONAL],
  },
  {
    label: "Matrículas",
    path: "/matriculas",
    icon: AssignmentIcon,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PERSONAL],
  },
  {
    label: "Personais",
    path: "/personais",
    icon: FitnessCenterIcon,
    roles: [UserRole.SUPER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    label: "Planos",
    path: "/planos",
    icon: WorkspacePremiumIcon,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PERSONAL, UserRole.ALUNO],
  },
  {
    label: "Treinos",
    path: "/treinos",
    icon: SportsGymnasticsIcon,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PERSONAL, UserRole.ALUNO],
  },
  {
    label: "Exercícios",
    path: "/exercicios",
    icon: FitnessCenterIcon,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PERSONAL],
  },
];

export const logoutItem = {
  label: "Sair",
  icon: LogoutIcon,
};