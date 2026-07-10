import React from "react";
import ReactDOM from "react-dom/client";

import { CssBaseline, ThemeProvider } from "@mui/material";

import AuthProvider from "@/features/auth/context/AuthProvider";

import App from "./App";
import theme from "@/theme";
import LoadingProvider from "./features/loading/context/LoadingProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
      <AuthProvider>

        <App />

        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  </React.StrictMode>
);