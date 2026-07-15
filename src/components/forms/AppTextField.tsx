import { TextField } from "@mui/material";
import type {TextFieldProps} from "@mui/material";

export type AppTextFieldProps = TextFieldProps & {

};

    export default function AppTextField({
    variant = "outlined",
    size = "small",
    fullWidth = true,
    slotProps,
    ...props
    }: AppTextFieldProps) {
    return (
        <TextField
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        slotProps={{
            htmlInput: {
            style: { padding: size === "small" ? "10px 14px" : undefined },
            ...slotProps?.htmlInput,
            },
        }}
        {...props}
        />
    );
    }