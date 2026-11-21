import { Box, Button, Card, CardContent, Typography, alpha } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

type CardColor = "primary" | "success" | "warning" | "error";

type Props = {
    title: string;
    value?: string | number;
    icon: React.ReactNode;
    color?: CardColor;
    onClick?: () => void;
    buttonText?: string;
    };

    export default function DashboardCard({
    title,
    value,
    icon,
    color = "primary",
    onClick,
    buttonText,
    }: Props) {
    const isAction = Boolean(buttonText || onClick);

    return (
        <Card
        variant="outlined"
        sx={{
            height: "100%",
            position: "relative",
            overflow: "hidden",
            borderRadius: 3,
            transition: "all .2s",
            "&::after": {
            content: '""',
            position: "absolute",
            top: -60,
            right: -60,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: (t) =>
                `radial-gradient(circle, ${alpha(t.palette[color].main, 0.18)}, transparent 70%)`,
            pointerEvents: "none",
            },
            "&:hover": {
            borderColor: (t) => alpha(t.palette[color].main, 0.5),
            transform: "translateY(-3px)",
            boxShadow: (t) => `0 12px 32px ${alpha(t.palette[color].main, 0.12)}`,
            },
        }}
        >
        <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
            <Box
            sx={{
                width: 52,
                height: 52,
                mb: 2.5,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                color: `${color}.main`,
                bgcolor: (t) => alpha(t.palette[color].main, 0.14),
            }}
            >
            {icon}
            </Box>

            <Typography
            variant="overline"
            sx={{
                display: "block",
                color: "text.secondary",
                fontWeight: 800,
                letterSpacing: 1.5,
                lineHeight: 1.4,
            }}
            >
            {title}
            </Typography>

            {isAction ? (
            <Button
                variant="contained"
                color={color}
                onClick={onClick}
                endIcon={<ArrowForward />}
                sx={{ mt: 2 }}
            >
                {buttonText ?? value}
            </Button>
            ) : (
            <Typography
                variant="h3"
                sx={{ fontWeight: 900, letterSpacing: -1, mt: 0.5 }}
            >
                {value ?? "—"}
            </Typography>
            )}
        </CardContent>
        </Card>
    );
}