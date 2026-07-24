import {
  Drawer,
  List,
  Toolbar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { menuItems, logoutItem } from "./menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
};

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onClose, isMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={mobileOpen}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>
              {item.icon && <item.icon />}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <Divider />

        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            {logoutItem.icon && <logoutItem.icon />}
          </ListItemIcon>
          <ListItemText primary={logoutItem.label} />
        </ListItemButton>
      </List>
    </Drawer>
  );
}