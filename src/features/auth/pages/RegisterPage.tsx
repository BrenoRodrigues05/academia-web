import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Stack,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
    } from "@mui/material";
    import {
    BadgeOutlined,
    BoltOutlined,
    EventAvailableOutlined,
    FitnessCenter,
    LockOutlined,
    MailOutlined,
    PersonOutlined,
    PhoneOutlined,
    TrendingUpOutlined,
    Visibility,
    VisibilityOff,
    } from "@mui/icons-material";

    import {
    registerSchema,
    type RegisterFormData,
    } from "../validation/registerSchema";
    import authService from "../services/authService";
    import PlanoService from "@/features/planos/api/PlanoService";
    import type { Plano } from "@/features/planos/types";
    import type { RegisterPixResponse } from "../types/types";
    import RegisterPixModal from "../components/RegisterPixModal";

    const ACCENT = "#C6FF3D";
    const BG = "#0A0A0F";
    const SURFACE = "#13131A";

    const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: ACCENT, contrastText: BG },
        background: { default: BG, paper: SURFACE },
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    },
    shape: { borderRadius: 12 },
    components: {
        MuiOutlinedInput: {
        styleOverrides: {
            root: {
            backgroundColor: "rgba(255,255,255,0.03)",
            "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
            "&:hover fieldset": { borderColor: "rgba(198,255,61,0.5)" },
            "&.Mui-focused fieldset": { borderColor: ACCENT },
            "&.Mui-error fieldset": { borderColor: "#f44336" },
            },
            input: { colorScheme: "dark" },
        },
        },
        MuiInputLabel: {
        styleOverrides: {
            root: { "&.Mui-focused:not(.Mui-error)": { color: ACCENT } },
        },
        },
    },
    });

    const features = [
    { icon: <EventAvailableOutlined />, text: "Treinos e agenda em um só lugar" },
    { icon: <TrendingUpOutlined />, text: "Acompanhe a evolução dos alunos" },
    { icon: <BoltOutlined />, text: "Gestão rápida, sem complicação" },
    ];

    const iconSx = { color: "text.secondary" };

    const startIcon = (icon: React.ReactNode) => ({
    input: {
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
    },
    });

    const formatMoney = (valor: number | string) =>
    Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <Typography
        variant="overline"
        sx={{ color: ACCENT, fontWeight: 800, letterSpacing: 2, mt: 1 }}
        >
        {children}
        </Typography>
    );
    }

    function Logo({ size = 44 }: { size?: number }) {
    return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
            sx={{
            width: size,
            height: size,
            borderRadius: 2,
            bgcolor: ACCENT,
            color: BG,
            display: "grid",
            placeItems: "center",
            }}
        >
            <FitnessCenter fontSize={size > 40 ? "medium" : "small"} />
        </Box>
        <Typography sx={{ fontWeight: 800, letterSpacing: 1 }}>
            ACADEMIA WEB
        </Typography>
        </Stack>
    );
    }

    export default function RegisterPage() {
    const navigate = useNavigate();
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [loadingPlanos, setLoadingPlanos] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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
            err.response?.data?.message ||
            "Não foi possível carregar os planos disponíveis.";
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
            err.response?.data?.message ||
            "Erro ao realizar cadastro. Tente novamente.";
        setErrorMsg(message);
        } finally {
        setSubmitting(false);
        }
    };

    const handlePaymentApproved = () => {
        setModalOpen(false);
        navigate("/", {
        state: {
            successMessage: "Pagamento confirmado! Sua conta está ativa. Faça login.",
        },
        });
    };

    return (
        <ThemeProvider theme={theme}>
        <Box
            sx={{
            minHeight: "100vh",
            display: "flex",
            bgcolor: BG,
            color: "text.primary",
            }}
        >
            <Box
            sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
                alignSelf: "flex-start",
                position: "sticky",
                top: 0,
                height: "100vh",
                p: 8,
                overflow: "hidden",
                background: `
                radial-gradient(circle at 20% 20%, rgba(198,255,61,0.18), transparent 45%),
                radial-gradient(circle at 90% 90%, rgba(198,255,61,0.10), transparent 40%),
                linear-gradient(160deg, #101018 0%, ${BG} 100%)
                `,
                borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
            >
            <Box
                sx={{
                position: "absolute",
                inset: 0,
                opacity: 0.04,
                backgroundImage:
                    "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 22px)",
                pointerEvents: "none",
                }}
            />

            <FitnessCenter
                sx={{
                position: "absolute",
                right: -70,
                bottom: -60,
                fontSize: 420,
                color: ACCENT,
                opacity: 0.06,
                transform: "rotate(-20deg)",
                pointerEvents: "none",
                }}
            />

            <Box sx={{ zIndex: 1 }}>
                <Logo />
            </Box>

            <Box sx={{ zIndex: 1 }}>
                <Typography
                sx={{
                    fontSize: { md: 48, lg: 64 },
                    fontWeight: 900,
                    lineHeight: 1.02,
                    letterSpacing: -1.5,
                    textTransform: "uppercase",
                }}
                >
                Comece hoje.
                <br />
                <Box component="span" sx={{ color: ACCENT }}>
                    Sem desculpas.
                </Box>
                </Typography>

                <Stack spacing={2} sx={{ mt: 5 }}>
                {features.map((f) => (
                    <Stack
                    key={f.text}
                    direction="row"
                    spacing={2}
                    sx={{
                        alignItems: "center",
                        color: "rgba(255,255,255,0.75)",
                    }}
                    >
                    <Box sx={{ color: ACCENT, display: "flex" }}>{f.icon}</Box>
                    <Typography>{f.text}</Typography>
                    </Stack>
                ))}
                </Stack>
            </Box>

            <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.4)", zIndex: 1 }}
            >
                © {new Date().getFullYear()} Academia Web
            </Typography>
            </Box>

            <Box
            sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 3, sm: 6 },
                py: 6,
            }}
            >
            <Box sx={{ width: "100%", maxWidth: 520 }}>
                <Box sx={{ display: { xs: "block", md: "none" }, mb: 5 }}>
                <Logo size={40} />
                </Box>

                <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 800 }}
                >
                Criar conta 🏋️‍♂️
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                Cadastre-se e escolha o seu plano para começar a treinar.
                </Typography>

                {errorMsg && (
                <Alert severity="error" variant="outlined" sx={{ mb: 3 }}>
                    {errorMsg}
                </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2.5}>
                    <SectionLabel>Dados pessoais</SectionLabel>

                    <Controller
                    name="nome"
                    control={control}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        label="Nome completo"
                        autoComplete="name"
                        fullWidth
                        error={!!errors.nome}
                        helperText={errors.nome?.message}
                        slotProps={startIcon(<BadgeOutlined sx={iconSx} />)}
                        />
                    )}
                    />

                    <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        type="email"
                        label="E-mail"
                        autoComplete="email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        slotProps={startIcon(<MailOutlined sx={iconSx} />)}
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
                            autoComplete="tel"
                            fullWidth
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                            slotProps={startIcon(<PhoneOutlined sx={iconSx} />)}
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
                            label="Data de nascimento"
                            fullWidth
                            error={!!errors.dataNascimento}
                            helperText={errors.dataNascimento?.message}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        )}
                    />
                    </Stack>

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

                    <SectionLabel>Acesso</SectionLabel>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Controller
                        name="login"
                        control={control}
                        render={({ field }) => (
                        <TextField
                            {...field}
                            label="Login / usuário"
                            autoComplete="username"
                            fullWidth
                            error={!!errors.login}
                            helperText={errors.login?.message}
                            slotProps={startIcon(<PersonOutlined sx={iconSx} />)}
                        />
                        )}
                    />

                    <Controller
                        name="senha"
                        control={control}
                        render={({ field }) => (
                        <TextField
                            {...field}
                            type={showPassword ? "text" : "password"}
                            label="Senha"
                            autoComplete="new-password"
                            fullWidth
                            error={!!errors.senha}
                            helperText={errors.senha?.message}
                            slotProps={{
                            input: {
                                startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlined sx={iconSx} />
                                </InputAdornment>
                                ),
                                endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    aria-label="Mostrar ou ocultar senha"
                                    >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                    </IconButton>
                                </InputAdornment>
                                ),
                            },
                            }}
                        />
                        )}
                    />
                    </Stack>

                    <SectionLabel>Seu plano</SectionLabel>

                    <Controller
                    name="planoId"
                    control={control}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        select
                        label="Escolha o plano"
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
                            {plano.nome} — {formatMoney(plano.valor)}
                            </MenuItem>
                        ))}
                        </TextField>
                    )}
                    />

                    <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={submitting}
                    sx={{
                        py: 1.6,
                        mt: 1,
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        boxShadow: "0 8px 24px rgba(198,255,61,0.25)",
                        "&:hover": {
                        bgcolor: "#d6ff6b",
                        boxShadow: "0 8px 32px rgba(198,255,61,0.4)",
                        },
                        "&.Mui-disabled": {
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.3)",
                        boxShadow: "none",
                        },
                    }}
                    >
                    {submitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Finalizar cadastro e gerar Pix 💳"
                    )}
                    </Button>

                    <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    >
                    Já tem uma conta?{" "}
                    <Link
                        component={RouterLink}
                        to="/"
                        underline="hover"
                        sx={{ fontWeight: 700, color: ACCENT }}
                    >
                        Faça login
                    </Link>
                    </Typography>
                </Stack>
                </form>
            </Box>
            </Box>

            <RegisterPixModal
            open={modalOpen}
            pixData={pixData}
            onPaymentApproved={handlePaymentApproved}
            onClose={() => {
                setModalOpen(false);
                navigate("/");
            }}
            />
        </Box>
        </ThemeProvider>
    );
}