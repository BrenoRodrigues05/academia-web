import {
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
    } from "@mui/material";

    type Props = {
    title: string;
    value?: string | number;
    icon: React.ReactNode;
    onClick?: () => void;
    buttonText?: string;
    };

    export default function DashboardCard({
    title,
    value,
    icon,
    onClick,
    buttonText,
    }: Props) {
    return (
        <Card sx={{ height: "100%" }}>
        <CardContent>
            <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
            {icon}

            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {title}
            </Typography>

            {buttonText || onClick ? (
                <Button
                variant="contained"
                color="primary"
                onClick={onClick}
                sx={{ textTransform: "none", fontWeight: "bold" }}
                >
                {buttonText ?? value}
                </Button>
            ) : (

                value !== undefined && (
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {value}
                </Typography>
                )
            )}
            </Stack>
        </CardContent>
        </Card>
    );
}