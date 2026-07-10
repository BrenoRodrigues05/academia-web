import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";

type NavbarProps = {

    onMenuClick: () => void;

};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{
              mr: 2,
              display: {
                  xs: "flex",
                  md: "none",
              },
          }}
      >

          <MenuIcon />

      </IconButton>
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