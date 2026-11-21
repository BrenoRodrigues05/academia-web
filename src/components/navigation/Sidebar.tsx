import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import { FitnessCenter } from "@mui/icons-material";
import { menuItems, logoutItem } from "./menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import SidebarItem from "./SidebarItem";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
};

const drawerWidth = 260;

export default function Sidebar({ mobileOpen, onClose, isMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role ? item.roles.includes(user.role) : false;
  });

  const LogoutIcon = logoutItem.icon;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={mobileOpen}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {isMobile ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 2.5 }}>
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
          <Typography sx={{ fontWeight: 800, letterSpacing: 1 }}>
            ACADEMIA WEB
          </Typography>
        </Box>
      ) : (
        <Toolbar />
      )}

      <Typography
        variant="overline"
        sx={{
          px: 3,
          pt: 2,
          pb: 1,
          color: "text.secondary",
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        Menu
      </Typography>

      <List sx={{ px: 1.5, flexGrow: 1, overflowY: "auto" }}>
        {filteredMenuItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            selected={location.pathname.startsWith(item.path)}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </List>

      <Divider />

      <List sx={{ px: 1.5, py: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "text.secondary",
            transition: "all .15s",
            "&:hover": {
              bgcolor: (t) => alpha(t.palette.error.main, 0.12),
              color: "error.main",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            {LogoutIcon && <LogoutIcon />}
          </ListItemIcon>
          <ListItemText
            primary={logoutItem.label}
            slotProps={{ primary: { sx: { fontWeight: 700, fontSize: 14 } } }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
}