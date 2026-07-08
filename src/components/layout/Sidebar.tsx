import {
  Drawer,
  List,
  Toolbar,
} from "@mui/material";

import SidebarItem from "./SidebarItem";
import { menuItems } from "@/config/menu";

const drawerWidth = 240;

export default function Sidebar() {
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
          <SidebarItem
            key={item.path}
            item={item}
          />
        ))}
      </List>
    </Drawer>
  );
}