import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import type { SelectProps } from "@mui/material";

export type SelectOption = {
    value: string | number;
    label: string;
};

export type AppSelectFieldProps = Omit<SelectProps, "label"> & {
    label: string;
    options: SelectOption[];
    helperText?: string;
    error?: boolean;
};

export default function AppSelectField({
    label,
    options,
    value,
    onChange,
    size = "small",
    fullWidth = true,
    error,
    helperText,
    ...props
    }: AppSelectFieldProps) {
    const labelId = `select-label-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <FormControl size={size} fullWidth={fullWidth} error={error}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
            labelId={labelId}
            label={label}
            value={value}
            onChange={onChange}
            {...props}
        >
            {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}