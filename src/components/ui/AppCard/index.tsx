import { Card, CardContent } from "@mui/material";
import type { CardProps } from "@mui/material";

export default function AppCard({ children, ...props }: CardProps) {
    return (
        <Card
        variant="outlined"
        {...props}
        sx={{
            borderRadius: 3,
            transition: "border-color .2s, transform .2s",
            "&:hover": { borderColor: "rgba(198,255,61,0.4)" },
            ...props.sx,
        }}
        >
        <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
            {children}
        </CardContent>
        </Card>
    );
}