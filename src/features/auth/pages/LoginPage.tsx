import { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

import {
  FitnessCenter,
  LockOutlined,
  PersonOutlined,
  Visibility,
  VisibilityOff,
  BoltOutlined,
  TrendingUpOutlined,
  EventAvailableOutlined,
} from "@mui/icons-material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const ACCENT = "#C6FF3D";
const BG = "#0A0A0F";
const SURFACE = "#13131A";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: ACCENT, contrastText: "#0A0A0F" },
    background: { default: BG, paper: SURFACE },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  },
  shape: { borderRadius: 12 },
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(198,255,61,0.5)" },
    "&.Mui-focused fieldset": { borderColor: ACCENT },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
};

const features = [
  { icon: <EventAvailableOutlined />, text: "Treinos e agenda em um só lugar" },
  { icon: <TrendingUpOutlined />, text: "Acompanhe a evolução dos alunos" },
  { icon: <BoltOutlined />, text: "Gestão rápida, sem complicação" },
];

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login: signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const canSubmit = !loading && login.trim() !== "" && senha.trim() !== "";

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      await signIn({ login, senha });
      navigate("/dashboard");
    } catch {
      setError("Login ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) handleLogin();
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
            flex: 1.1,
            p: 8,
            position: "relative",
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

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center", zIndex: 1 }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: ACCENT,
                color: BG,
                display: "grid",
                placeItems: "center",
              }}
            >
              <FitnessCenter />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: 1 }}
            >
              ACADEMIA WEB
            </Typography>
          </Stack>

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
              Gerencie.
              <br />
              Evolua.
              <br />
              <Box component="span" sx={{ color: ACCENT }}>
                Supere limites.
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
            p: { xs: 3, sm: 6 },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", maxWidth: 400 }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
                display: { xs: "flex", md: "none" },
                mb: 5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: ACCENT,
                  color: BG,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <FitnessCenter fontSize="small" />
              </Box>
              <Typography sx={{ fontWeight: 800, letterSpacing: 1 }}>
                ACADEMIA WEB
              </Typography>
            </Stack>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
              Bem-vindo de volta 👊
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Entre para acessar o painel da sua academia.
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
                autoFocus
                fullWidth
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Senha"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                fullWidth
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="Mostrar ou ocultar senha"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {error && (
                <Box
                  sx={{
                    px: 2,
                    py: 1.25,
                    borderRadius: 2,
                    bgcolor: "rgba(244,67,54,0.12)",
                    border: "1px solid rgba(244,67,54,0.4)",
                  }}
                >
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!canSubmit}
                sx={{
                  py: 1.6,
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
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Entrar"
                )}
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
              >
                Ainda não tem uma conta?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  underline="hover"
                  sx={{ fontWeight: 700, color: ACCENT }}
                >
                  Cadastre-se aqui
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}