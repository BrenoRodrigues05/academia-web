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
import { menuItems, logoutItem } from "../../config/menu";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
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