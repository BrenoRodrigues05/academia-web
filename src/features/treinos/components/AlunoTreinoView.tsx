import { useEffect, useState } from "react";
import {
    Box,
    Chip,
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    } from "@mui/material";
    import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
    import HistoryIcon from "@mui/icons-material/History";

    import MainLayout from "@/layouts/MainLayout";
    import { AppPageHeader, AppLoading } from "@/components/ui";
    import { ErrorState, EmptyState } from "@/components/feedback";
    import CrudTable from "@/components/crud/CrudTable";
    import type { CrudColumn } from "@/components/crud/types";

    import TreinoService from "../api/TreinoService";
    import type { Treino } from "../types";

    interface ItemTreino {
    id?: number;
    series: number;
    repeticoes: number;
    descansoSegundos: number;
    nomeExercicio?: string;
    exercicioId?: number;
    exercicio?: {
        id: number;
        nome: string;
        grupoMuscular?: string;
    };
    }

    export default function AlunoTreinoView() {
    const [treinoAtivo, setTreinoAtivo] = useState<Treino | null>(null);
    const [historico, setHistorico] = useState<Treino[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const carregarDados = async () => {
        setLoading(true);
        setError(false);
        try {
        const [treinoRes, historicoRes] = await Promise.allSettled([
            TreinoService.meuTreino(),
            TreinoService.meuHistorico(),
        ]);

        if (treinoRes.status === "fulfilled") {
            setTreinoAtivo(treinoRes.value);
        }
        if (historicoRes.status === "fulfilled") {
            setHistorico(historicoRes.value);
        }
        } catch (err) {
        console.error("Erro ao carregar treinos do aluno:", err);
        setError(true);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const exercicioColumns: CrudColumn<ItemTreino>[] = [
        {
        field: "nomeExercicio",
        header: "Exercício",
        render: (item) => item.nomeExercicio ?? item.exercicio?.nome ?? "Exercício",
        },
        {
        field: "series",
        header: "Séries",
        render: (item) => item.series,
        },
        {
        field: "repeticoes",
        header: "Repetições",
        render: (item) => item.repeticoes,
        },
        {
        field: "descansoSegundos",
        header: "Descanso",
        render: (item) => `${item.descansoSegundos}s`,
        },
    ];

    const historicoColumns: CrudColumn<Treino>[] = [
        {
        field: "nome",
        header: "Nome do Treino",
        },
        {
        field: "nomePersonal",
        header: "Personal",
        render: (treino) => treino.nomePersonal ?? treino.personal?.nome ?? "-",
        },
        {
        field: "dataInicio",
        header: "Início",
        render: (treino) => treino.dataInicio ?? "-",
        },
        {
        field: "dataFim",
        header: "Fim",
        render: (treino) => treino.dataFim ?? "-",
        },
        {
        field: "ativo",
        header: "Status",
        render: (treino) => (
            <Chip
            label={treino.ativo ? "Ativo" : "Concluído"}
            color={treino.ativo ? "success" : "default"}
            size="small"
            />
        ),
        },
    ];

    return (
        <MainLayout>
        <AppPageHeader
            title="Meus Treinos"
            subtitle="Consulte sua ficha de treino ativa e seu histórico"
        />

        {loading ? (
            <AppLoading />
        ) : error ? (
            <ErrorState
            message="Não foi possível carregar suas informações de treino."
            onRetry={carregarDados}
            />
        ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Ficha de Treino Atual
                </Typography>

                {treinoAtivo ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                    >
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                        {treinoAtivo.nome}
                        </Typography>
                        {treinoAtivo.observacoes && (
                        <Typography variant="body2" color="text.secondary">
                            {treinoAtivo.observacoes}
                        </Typography>
                        )}
                    </Box>
                    <Chip label="Ativo" color="success" size="small" />
                    </Box>

                    <CrudTable<ItemTreino>
                    columns={exercicioColumns}
                    rows={(treinoAtivo.itens as ItemTreino[]) ?? []}
                    rowKey={(item) => item.id ?? item.exercicioId ?? 0}
                    />
                </Paper>
                ) : (
                <EmptyState message="Você não possui nenhum treino ativo no momento." />
                )}
            </Box>

            <Accordion variant="outlined" disableGutters sx={{ borderRadius: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HistoryIcon color="action" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Ver Histórico de Treinos
                    </Typography>
                    {historico.length > 0 && (
                    <Chip label={historico.length} size="small" color="primary" variant="outlined" />
                    )}
                </Box>
                </AccordionSummary>

                <AccordionDetails>
                {historico.length > 0 ? (
                    <CrudTable<Treino>
                    columns={historicoColumns}
                    rows={historico}
                    rowKey={(treino) => treino.id}
                    />
                ) : (
                    <EmptyState message="Nenhum registro de treino anterior encontrado no histórico." />
                )}
                </AccordionDetails>
            </Accordion>
            </Box>
        )}
        </MainLayout>
    );
}