import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import LogoutIcon from "@mui/icons-material/Logout";

export interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
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
  },
  {
    label: "Matrículas",
    path: "/matriculas",
    icon: AssignmentIcon,
  },
  {
    label: "Personais",
    path: "/personais",
    icon: FitnessCenterIcon,
  },
  {
    label: "Planos",
    path: "/planos",
    icon: WorkspacePremiumIcon,
  },
  {
    label: "Treinos",
    path: "/treinos",
    icon: SportsGymnasticsIcon,
  },
  {
        label: "Exercícios",
        path: "/exercicios",
        icon: FitnessCenterIcon,
    },
];

export const logoutItem = {
    label: "Sair",
    icon: LogoutIcon,
};