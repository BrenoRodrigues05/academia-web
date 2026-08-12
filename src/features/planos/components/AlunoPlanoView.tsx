import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Typography,
    Alert,
    } from "@mui/material";
    import CancelIcon from "@mui/icons-material/Cancel";
    import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
    import CheckCircleIcon from "@mui/icons-material/CheckCircle";
    import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
    import StarIcon from "@mui/icons-material/Star";

    import MainLayout from "@/layouts/MainLayout";
    import { AppPageHeader, AppLoading } from "@/components/ui";
    import { ErrorState } from "@/components/feedback";

    import MatriculaService from "@/features/matriculas/api/MatriculaService";

    export default function AlunoPlanoView() {
    const [matricula, setMatricula] = useState<any | null>(null);
    const [planosDisponiveis, setPlanosDisponiveis] = useState<any[]>([]);
    const [semPlano, setSemPlano] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [planoSelecionado, setPlanoSelecionado] = useState<any | null>(null);
    const [openContratarModal, setOpenContratarModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const isAtiva = Boolean(matricula?.ativa ?? matricula?.ativo);
    const precisaAssinar = semPlano || (matricula && !isAtiva);

    const carregarDados = async () => {
        setLoading(true);
        setError(false);
        setSemPlano(false);

        try {
        const data = await MatriculaService.getMeuPlano();
        setMatricula(data);
        const matriculaAtiva = Boolean(data?.ativa ?? data?.ativo);
        if (!matriculaAtiva) {
            await buscarPlanosDisponiveis();
        }
        } catch (err: any) {
        if (err.response?.status === 404) {
            setSemPlano(true);
            await buscarPlanosDisponiveis();
        } else {
            console.error("Erro ao carregar o plano do aluno:", err);
            setError(true);
        }
        } finally {
        setLoading(false);
        }
    };

    const buscarPlanosDisponiveis = async () => {
        try {
        const res = await MatriculaService.getPlanos();
        setPlanosDisponiveis(res.content ?? []);
        } catch (err) {
        console.error("Erro ao buscar planos disponíveis:", err);
        setError(true);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const handleCancelarPlano = async () => {
        if (!matricula?.id) return;
        setActionLoading(true);
        try {
        await MatriculaService.alterarStatus(matricula.id, false);
        setOpenCancelModal(false);
        carregarDados();
        } catch (err) {
        console.error("Erro ao cancelar matrícula:", err);
        } finally {
        setActionLoading(false);
        }
    };

    const handleContratarPlano = async () => {
        if (!planoSelecionado) return;
        setActionLoading(true);
        try {
        if (matricula && !isAtiva) {
            await MatriculaService.editarPlano(matricula.id, planoSelecionado.id);
            await MatriculaService.alterarStatus(matricula.id, true);
        } else {
            await MatriculaService.create({ planoId: planoSelecionado.id });
        }

        setOpenContratarModal(false);
        setPlanoSelecionado(null);
        carregarDados(); 
        } catch (err) {
        console.error("Erro ao contratar plano:", err);
        } finally {
        setActionLoading(false);
        }
    };

    return (
        <MainLayout>
        <AppPageHeader
            title="Meu Plano"
            subtitle="Gerencie os detalhes da sua assinatura e mensalidade"
        />

        {loading ? (
            <AppLoading />
        ) : error ? (
            <ErrorState
            message="Não foi possível carregar as informações do seu plano."
            onRetry={carregarDados}
            />
        ) : precisaAssinar ? (
            <Box sx={{ maxWidth: 900, mx: "auto", mt: 2 }}>
            {semPlano ? (
                <Alert
                severity="info"
                icon={<FitnessCenterIcon fontSize="inherit" />}
                sx={{ mb: 4, borderRadius: 2 }}
                >
                <strong>Você ainda não possui um plano ativo!</strong> Escolha uma das opções abaixo para assinar e liberar seus treinos.
                </Alert>
            ) : (
                <Alert
                severity="warning"
                icon={<CancelIcon fontSize="inherit" />}
                sx={{ mb: 4, borderRadius: 2 }}
                >
                <strong>Sua assinatura do plano ({matricula?.plano?.nome ?? matricula?.nomePlano}) está inativa ou foi cancelada.</strong> Escolha um plano abaixo para reativar seu acesso à academia.
                </Alert>
            )}

            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
                Planos Disponíveis
            </Typography>

            <Box
                sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 3,
                }}
            >
                {planosDisponiveis.map((plano) => (
                <Card
                    key={plano.id}
                    variant="outlined"
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                        borderColor: "primary.main",
                    },
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: "bold", mb: 1 }}>
                        {plano.nome}
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: "bold", my: 2 }}>
                        R$ {(Number(plano.valor ?? 0)).toFixed(2)}
                        <Typography component="span" variant="caption" color="text.secondary">
                        /mês
                        </Typography>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60 }}>
                        {plano.descricao ?? "Acesso livre às dependências da academia e acompanhamento do seu treino."}
                    </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<StarIcon />}
                        onClick={() => {
                        setPlanoSelecionado(plano);
                        setOpenContratarModal(true);
                        }}
                    >
                        Contratar Plano
                    </Button>
                    </CardActions>
                </Card>
                ))}
            </Box>
            </Box>
        ) : (
            <Box sx={{ maxWidth: 700, mx: "auto", mt: 3 }}>
            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
                <CardContent sx={{ p: 3 }}>
                <Box
                    sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    }}
                >
                    <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
                    {matricula.plano?.nome ?? matricula.nomePlano ?? "Plano Contratado"}
                    </Typography>

                    <Chip
                    icon={<CheckCircleIcon />}
                    label="Ativo"
                    color="success"
                    variant="filled"
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                    sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                    }}
                >
                    <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Valor Mensal
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
                        R$ {((matricula.plano?.valor ?? matricula.valorPlano ?? 0) as number).toFixed(2)}
                        <Typography component="span" variant="caption" color="text.secondary">
                        /mês
                        </Typography>
                    </Typography>
                    </Box>

                    <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Data de Início da Matrícula
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {matricula.dataMatricula ?? matricula.dataInicio ?? "-"}
                    </Typography>
                    </Box>

                    {matricula.plano?.descricao && (
                    <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Benefícios do Plano
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {matricula.plano.descricao}
                        </Typography>
                    </Box>
                    )}
                </Box>
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: "flex-end", p: 2, gap: 1 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<SwapHorizIcon />}
                    onClick={() => {
                    alert("Para alterar seu plano, entre em contato com a recepção.");
                    }}
                >
                    Alterar Plano
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setOpenCancelModal(true)}
                >
                    Cancelar Plano
                </Button>
                </CardActions>
            </Card>
            </Box>
        )}

        <Dialog open={openContratarModal} onClose={() => setOpenContratarModal(false)}>
            <DialogTitle>Confirmar Assinatura</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Deseja confirmar a contratação do plano <strong>{planoSelecionado?.nome}</strong> no valor de{" "}
                <strong>R$ {Number(planoSelecionado?.valor ?? 0).toFixed(2)}/mês</strong>?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenContratarModal(false)} disabled={actionLoading}>
                Voltar
            </Button>
            <Button
                onClick={handleContratarPlano}
                color="primary"
                variant="contained"
                disabled={actionLoading}
            >
                {actionLoading ? "Processando..." : "Confirmar e Assinar"}
            </Button>
            </DialogActions>
        </Dialog>

        <Dialog open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
            <DialogTitle>Confirmar Cancelamento</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Tem certeza de que deseja cancelar a sua matrícula atual no plano{" "}
                <strong>{matricula?.plano?.nome ?? matricula?.nomePlano}</strong>?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenCancelModal(false)} disabled={actionLoading}>
                Manter Plano
            </Button>
            <Button
                onClick={handleCancelarPlano}
                color="error"
                variant="contained"
                disabled={actionLoading}
            >
                {actionLoading ? "Cancelando..." : "Confirmar Cancelamento"}
            </Button>
            </DialogActions>
        </Dialog>
        </MainLayout>
    );
}