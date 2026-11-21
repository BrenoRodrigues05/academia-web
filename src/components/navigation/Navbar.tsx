import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import { FitnessCenter, Menu as MenuIcon } from "@mui/icons-material";
import { useAuth } from "@/features/auth/hooks/useAuth";

type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  const roleLabel = user?.role
    ? String(user.role).replace(/_/g, " ").toLowerCase()
    : "";

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: alpha("#0A0A0F", 0.8),
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "grid",
            placeItems: "center",
          }}
        >
          <FitnessCenter fontSize="small" />
        </Box>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1, fontSize: 18 }}
        >
          ACADEMIA WEB
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {user.login}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  letterSpacing: 0.5,
                }}
              >
                {roleLabel}
              </Typography>
            </Box>

            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 800,
                boxShadow: "0 0 0 3px rgba(198,255,61,0.2)",
              }}
            >
              {user.login?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}