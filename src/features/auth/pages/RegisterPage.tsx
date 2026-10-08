import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem,
    Box,
    Alert,
    CircularProgress,
    Link,
    } from "@mui/material";

    import { registerSchema, type RegisterFormData } from "../validation/registerSchema";
    import authService from "../services/authService";
    import PlanoService from "@/features/planos/api/PlanoService";
    import type { Plano } from "@/features/planos/types";
    import type { RegisterPixResponse } from "../types/types";
    import RegisterPixModal from "../components/RegisterPixModal";

    export default function RegisterPage() {
    const navigate = useNavigate();
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [loadingPlanos, setLoadingPlanos] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [pixData, setPixData] = useState<RegisterPixResponse | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
        login: "",
        senha: "",
        nome: "",
        email: "",
        dataNascimento: "",
        telefone: "",
        sexo: "MASCULINO",
        planoId: "" as any, 
        },
    });

    useEffect(() => {
        const fetchPlanos = async () => {
        try {
            setLoadingPlanos(true);
            setErrorMsg(null);

            const response = await PlanoService.findAll();

            if (response && Array.isArray(response.content)) {
            setPlanos(response.content);
            } else {
            setPlanos([]);
            }
        } catch (err: any) {
            console.error("Erro ao carregar planos:", err);
            const msg =
            err.response?.data?.message || "Não foi possível carregar os planos disponíveis.";
            setErrorMsg(msg);
        } finally {
            setLoadingPlanos(false);
        }
        };

        fetchPlanos();
    }, []);

    const onSubmit = async (data: RegisterFormData) => {
        setSubmitting(true);
        setErrorMsg(null);
        try {
        const response = await authService.register(data);
        setPixData(response);
        setModalOpen(true);
        } catch (err: any) {
        const message =
            err.response?.data?.message || "Erro ao realizar cadastro. Tente novamente.";
        setErrorMsg(message);
        } finally {
        setSubmitting(false);
        }
    };

    const handlePaymentApproved = () => {
        setModalOpen(false);
        navigate("/", {
        state: { successMessage: "Pagamento confirmado! Sua conta está ativa. Faça login." },
        });
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
            >
            Criar Conta 🏋️‍♂️
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Cadastre-se e escolha o seu plano para começar a treinar
            </Typography>

            {errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
                {errorMsg}
            </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
                <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                    <TextField
                    {...field}
                    label="Nome Completo"
                    fullWidth
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                    />
                )}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Controller
                    name="login"
                    control={control}
                    render={({ field }) => (
                    <TextField
                        {...field}
                        label="Login / Usuário"
                        fullWidth
                        error={!!errors.login}
                        helperText={errors.login?.message}
                    />
                    )}
                />

                <Controller
                    name="senha"
                    control={control}
                    render={({ field }) => (
                    <TextField
                        {...field}
                        type="password"
                        label="Senha"
                        fullWidth
                        error={!!errors.senha}
                        helperText={errors.senha?.message}
                    />
                    )}
                />
                </Stack>

                <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextField
                    {...field}
                    type="email"
                    label="E-mail"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    />
                )}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Controller
                    name="telefone"
                    control={control}
                    render={({ field }) => (
                    <TextField
                        {...field}
                        label="Telefone"
                        fullWidth
                        error={!!errors.telefone}
                        helperText={errors.telefone?.message}
                    />
                    )}
                />

                <Controller
                    name="dataNascimento"
                    control={control}
                    render={({ field }) => (
                    <TextField
                        {...field}
                        type="date"
                        label="Data de Nascimento"
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                        error={!!errors.dataNascimento}
                        helperText={errors.dataNascimento?.message}
                    />
                    )}
                />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Controller
                    name="sexo"
                    control={control}
                    render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label="Sexo"
                        fullWidth
                        error={!!errors.sexo}
                        helperText={errors.sexo?.message}
                    >
                        <MenuItem value="MASCULINO">Masculino</MenuItem>
                        <MenuItem value="FEMININO">Feminino</MenuItem>
                    </TextField>
                    )}
                />

                <Controller
                    name="planoId"
                    control={control}
                    render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label="Escolha o Plano"
                        fullWidth
                        disabled={loadingPlanos}
                        error={!!errors.planoId}
                        helperText={errors.planoId?.message}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                        <MenuItem value="" disabled>
                        {loadingPlanos ? "Carregando..." : "Selecione um plano"}
                        </MenuItem>
                        {planos.map((plano) => (
                        <MenuItem key={plano.id} value={plano.id}>
                            {plano.nome} - R$ {plano.valor}
                        </MenuItem>
                        ))}
                    </TextField>
                    )}
                />
                </Stack>

                <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting}
                sx={{ py: 1.5, mt: 1 }}
                >
                {submitting ? <CircularProgress size={24} /> : "Finalizar Cadastro e Gerar Pix 💳"}
                </Button>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                    Já tem uma conta?{" "}
                    <Link component={RouterLink} to="/" underline="hover">
                    Faça Login
                    </Link>
                </Typography>
                </Box>
            </Stack>
            </form>
        </Paper>

        <RegisterPixModal
            open={modalOpen}
            pixData={pixData}
            onPaymentApproved={handlePaymentApproved}
            onClose={() => {
            setModalOpen(false);
            navigate("/");
            }}
        />
        </Container>
    );
}