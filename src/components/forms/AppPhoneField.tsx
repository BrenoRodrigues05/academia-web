import { TextField } from "@mui/material";
import type {TextFieldProps} from "@mui/material";

export type AppPhoneFieldProps = TextFieldProps;

export default function AppPhoneField({
    label = "Telefone",
    size = "small",
    fullWidth = true,
    slotProps,
    ...props
    }: AppPhoneFieldProps) {
    return (
        <TextField
        label={label}
        size={size}
        fullWidth={fullWidth}
        slotProps={{
            htmlInput: {
            inputMode: "tel", 
            pattern: "[0-9]*",
            style: { padding: size === "small" ? "10px 14px" : undefined },
            ...slotProps?.htmlInput,
            },
        }}
        {...props}
        />
    );
}