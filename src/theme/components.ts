import type { Components } from "@mui/material/styles";

export const components: Components = {
    MuiButton: {
    defaultProps: {
        disableElevation: true,
    },

    styleOverrides: {
        root: {
        borderRadius: 10,
        },
    },
    },

    MuiPaper: {
    styleOverrides: {
        root: {
        borderRadius: 12,
        },
    },
    },

    MuiTextField: {
    defaultProps: {
        fullWidth: true,
        variant: "outlined",
    },
    },

    MuiCard: {
    styleOverrides: {
        root: {
        borderRadius: 16,
        },
    },
    },
};