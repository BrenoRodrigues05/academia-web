import type { ReactNode } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";

import AuthProvider from "@/features/auth/context/AuthProvider";

import theme from "@/theme"; 

type Props = {

    children: ReactNode;

};

export default function AppProviders({

    children,

}: Props) {

    return (

        <ThemeProvider theme={theme}>

            <CssBaseline />

            <AuthProvider>

                {children}

            </AuthProvider>

        </ThemeProvider>

    );

}