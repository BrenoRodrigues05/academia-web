import {
  Box,
  Toolbar,
} from "@mui/material";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({
  children,
}: Props) {

  return (

    <Box sx={{ display: "flex" }}>

      <Navbar />

      <Sidebar />

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