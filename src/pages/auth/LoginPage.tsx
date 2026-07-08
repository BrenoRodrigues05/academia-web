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

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

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
              type="password"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
            >
              Entrar
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}