import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          Academia Web
        </Typography>

        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                {user.login}
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.8, textTransform: "capitalize" }}
              >
                {user.role}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {user.login?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}