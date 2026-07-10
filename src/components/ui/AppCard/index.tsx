import {
    Card,
    CardContent,
} from "@mui/material";
import type { CardProps } from "@mui/material";

type Props = CardProps;

export default function AppCard({
    children,
    ...props
}: Props) {
    return (
    <Card {...props}>
        <CardContent>

        {children}

        </CardContent>
    </Card>
    );
}