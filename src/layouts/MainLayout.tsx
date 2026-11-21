import { useState, type ReactNode } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  createTheme,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";

const ACCENT = "#C6FF3D";
const BG = "#0A0A0F";
const SURFACE = "#13131A";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: ACCENT, contrastText: BG },
    background: { default: BG, paper: SURFACE },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: SURFACE,
          backgroundImage: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
        colorPrimary: { backgroundColor: SURFACE, color: "#fff" },
        colorDefault: { backgroundColor: SURFACE, color: "#fff" },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: SURFACE,
          backgroundImage: "none",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.03)",
          "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
          "&:hover fieldset": { borderColor: "rgba(198,255,61,0.5)" },
          "&.Mui-focused fieldset": { borderColor: ACCENT },
          "&.Mui-error fieldset": { borderColor: "#f44336" },
        },
        input: { colorScheme: "dark" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { "&.Mui-focused:not(.Mui-error)": { color: ACCENT } },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 800,
          letterSpacing: 0.8,
        },
        containedPrimary: {
          boxShadow: "0 6px 20px rgba(198,255,61,0.22)",
          "&:hover": {
            backgroundColor: "#d6ff6b",
            boxShadow: "0 8px 28px rgba(198,255,61,0.38)",
          },
          "&.Mui-disabled": {
            backgroundColor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.3)",
            boxShadow: "none",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#22222c",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12,
        },
      },
    },
  },
});

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar onMenuClick={handleDrawerToggle} />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
        isMobile={isMobile}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0, 
          p: { xs: 2, md: 4 },
          background: `radial-gradient(circle at 100% 0%, rgba(198,255,61,0.06), transparent 40%), ${BG}`,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default function MainLayout({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
}