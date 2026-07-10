import {
  Drawer,
  List,
  Toolbar,
} from "@mui/material";
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import { menuItems, logoutItem } from "./menu";
import { Link, useLocation } from "react-router-dom";

type SidebarProps = {

    mobileOpen: boolean;

    onClose: () => void;

    isMobile: boolean;

};

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onClose, isMobile }: SidebarProps) {
  const location = useLocation();
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

            <ListItemText
                primary={item.label}
            />

        </ListItemButton>

      ))}
      <Divider />

        <List>

            <ListItemButton>

                <ListItemIcon>

                    {logoutItem.icon && <logoutItem.icon />}

                </ListItemIcon>

                <ListItemText
                    primary={logoutItem.label}
                />

            </ListItemButton>

        </List>
      </List>
    </Drawer>
  );
}