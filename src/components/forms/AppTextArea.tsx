import { TextField } from "@mui/material";
import type {TextFieldProps} from "@mui/material";

export type AppTextAreaProps = Omit<TextFieldProps, "multiline"> & {
    minRows?: number;
};

export default function AppTextArea({
    label,
    minRows = 3,
    size = "small",
    fullWidth = true,
    ...props
    }: AppTextAreaProps) {
    return (
        <TextField
        label={label}
        multiline
        minRows={minRows}
        size={size}
        fullWidth={fullWidth}
        {...props}
        />
    );
}