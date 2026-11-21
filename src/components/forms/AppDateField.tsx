import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export type AppDateFieldProps = Omit<TextFieldProps, "type">;

export default function AppDateField({
    label = "Data de Nascimento",
    size = "small",
    fullWidth = true,
    slotProps,
    ...props
    }: AppDateFieldProps) {
    return (
        <TextField
        label={label}
        type="date"
        size={size}
        fullWidth={fullWidth}
        {...props}
        slotProps={{
            ...slotProps,
            inputLabel: {
            shrink: true,
            ...slotProps?.inputLabel,
            },
            htmlInput: {
            style: { padding: size === "small" ? "10px 14px" : undefined },
            ...slotProps?.htmlInput,
            },
        }}
        />
    );
}