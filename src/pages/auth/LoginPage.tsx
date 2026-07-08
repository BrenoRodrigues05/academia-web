import { Button, Container, Typography } from "@mui/material";

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 2 }}>
        Academia Web
      </Typography>

      <Button variant="contained" sx={{ mt: 4 }}>
        Entrar
      </Button>
    </Container>
  );
}