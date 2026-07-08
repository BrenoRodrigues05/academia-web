import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Link } from "react-router-dom";

import type { MenuItem } from "@/config/menu";

type Props = {
  item: MenuItem;
};

export default function SidebarItem({ item }: Props) {
  const Icon = item.icon;

  return (
    <ListItemButton
      component={Link}
      to={item.path}
    >
      <ListItemIcon>
        <Icon />
      </ListItemIcon>

      <ListItemText primary={item.label} />
    </ListItemButton>
  );
}