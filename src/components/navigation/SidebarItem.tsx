import { ListItemButton, ListItemIcon, ListItemText, alpha } from "@mui/material";
import { Link } from "react-router-dom";

import type { MenuItem } from "@/components/navigation/menu";

type Props = {
  item: MenuItem;
  selected?: boolean;
  onClick?: () => void;
};

export default function SidebarItem({ item, selected = false, onClick }: Props) {
  const Icon = item.icon;

  return (
    <ListItemButton
      component={Link}
      to={item.path}
      selected={selected}
      onClick={onClick}
      sx={{
        position: "relative",
        borderRadius: 2,
        mb: 0.5,
        py: 1.1,
        color: "text.secondary",
        transition: "all .15s",
        "&:hover": {
          bgcolor: "action.hover",
          color: "text.primary",
        },
        "&.Mui-selected": {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
          color: "primary.main",
          "&:hover": {
            bgcolor: (t) => alpha(t.palette.primary.main, 0.18),
          },
          "&::before": {
            content: '""',
            position: "absolute",
            left: -12,
            top: 8,
            bottom: 8,
            width: 4,
            borderRadius: "0 4px 4px 0",
            bgcolor: "primary.main",
            boxShadow: "0 0 12px rgba(198,255,61,0.6)",
          },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
        <Icon />
      </ListItemIcon>

      <ListItemText
        primary={item.label}
        slotProps={{ primary: { sx: { fontWeight: 700, fontSize: 14 } } }}
      />
    </ListItemButton>
  );
}