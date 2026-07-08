import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
} from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="fixed">

      <Toolbar>

        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          Academia Web
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >

          <Typography>
            Breno Rodrigues
          </Typography>

          <Avatar>B</Avatar>

        </Box>

      </Toolbar>

    </AppBar>
  );
}