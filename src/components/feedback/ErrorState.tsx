import { Box, Button, Typography, alpha } from "@mui/material";
import { ErrorOutlined, Refresh } from "@mui/icons-material";

type Props = {
    message: string;
    onRetry?: () => void;
    };

    export default function ErrorState({ message, onRetry }: Props) {
    return (
        <Box
        role="alert"
        sx={{
            py: 6,
            px: 3,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: (t) => alpha(t.palette.error.main, 0.4),
            bgcolor: (t) => alpha(t.palette.error.main, 0.06),
        }}
        >
        <Box
            sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "error.main",
            bgcolor: (t) => alpha(t.palette.error.main, 0.12),
            }}
        >
            <ErrorOutlined sx={{ fontSize: 36 }} />
        </Box>

        <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
            Algo deu errado
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {message}
        </Typography>

        {onRetry && (
            <Button
            variant="outlined"
            color="error"
            startIcon={<Refresh />}
            onClick={onRetry}
            sx={{ mt: 3 }}
            >
            Tentar novamente
            </Button>
        )}
        </Box>
    );
}