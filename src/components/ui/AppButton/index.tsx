import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

export default function AppButton({ children, ...props }: ButtonProps) {
    return (
        <Button
        variant="contained"
        size="large"
        {...props}
        sx={{ borderRadius: 2, px: 3, ...props.sx }}
        >
        {children}
        </Button>
    );
}