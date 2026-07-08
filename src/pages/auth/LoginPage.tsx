import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import {
  IconButton,
  InputAdornment,
} from "@mui/material";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const { login: signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    await signIn({login, senha});
    navigate("/dashboard");

  } catch {
    setError("Login ou senha inválidos.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
          >
            Academia Web
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }} 
          >
            Faça login para acessar o sistema.
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Login"
              value={login}
              onChange={(e) =>
                setLogin(e.target.value)
              }
              fullWidth
            />

            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        edge="end"
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
            {error && (
                <Typography
                    color="error"
                    variant="body2"
                >
                    {error}
                </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLogin}
              disabled={
                  loading ||
                  login.trim() === "" ||
                  senha.trim() === ""
              }
          >
              {loading ? "Entrando..." : "Entrar"}
          </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}