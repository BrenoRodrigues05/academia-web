import { Box, CircularProgress, Typography } from "@mui/material";

export default function AppLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 8,
      }}
    >
      <CircularProgress thickness={4} />
      <Typography variant="body2" color="text.secondary">
        Carregando...
      </Typography>
    </Box>
  );
}