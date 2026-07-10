import {
  Backdrop,
  CircularProgress,
} from "@mui/material";

type Props = {
  open: boolean;
};

export default function LoadingOverlay({
  open,
}: Props) {

  return (

    <Backdrop

      open={open}

      sx={{

        color: "#fff",

        zIndex: (theme) => theme.zIndex.drawer + 100,

      }}

    >

      <CircularProgress color="inherit" />

    </Backdrop>

  );

}