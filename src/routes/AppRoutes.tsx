import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AlunosPage from "@/features/alunos/pages/AlunosPage";
import PersonaisPage from "@/features/personais/pages/PersonaisPage";
import PlanosPage from "@/features/planos/pages/PlanosPage";
import MatriculasPage from "@/features/matriculas/pages/MatriculasPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
          <LoginPage />
          </PublicRoute>} />
      <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <DashboardPage />
        </ProtectedRoute>
    }
/>
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="*" element={<NotFoundPage />} />

      <Route path="/personais" element={<PersonaisPage />} />
        <Route path="*" element={<NotFoundPage />} />
    
      <Route path="/planos" element={<PlanosPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route path="/matriculas" element={<MatriculasPage />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
    
  );
}
