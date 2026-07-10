import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

type Props = ButtonProps;

export default function AppButton({
    children,
    ...props
}: Props) {
    return (
    <Button
        variant="contained"
        size="large"
        {...props}
    >
        {children}
    </Button>
    ) ;
}