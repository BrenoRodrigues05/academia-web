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
import ExerciciosPage from "@/features/exercicios/pages/ExerciciosPage";
import TreinosPage from "@/features/treinos/pages/TreinosPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/alunos"
                    element={
                        <ProtectedRoute>
                            <AlunosPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/personais"
                    element={
                        <ProtectedRoute>
                            <PersonaisPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/planos"
                    element={
                        <ProtectedRoute>
                            <PlanosPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/matriculas"
                    element={
                        <ProtectedRoute>
                            <MatriculasPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/exercicios"
                    element={
                        <ProtectedRoute>
                            <ExerciciosPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/treinos"
                    element={
                        <ProtectedRoute>
                            <TreinosPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}