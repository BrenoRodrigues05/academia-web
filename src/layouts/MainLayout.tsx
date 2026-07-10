import {
  Box,
  Toolbar,
} from "@mui/material";

import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({children}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
};
  return (

    <Box sx={{ display: "flex" }}>

      <Navbar onMenuClick={handleDrawerToggle} />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
        isMobile={isMobile}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >

        <Toolbar />

        {children}

      </Box>

    </Box>

  );
}