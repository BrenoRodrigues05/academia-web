import { Backdrop, CircularProgress } from "@mui/material";

type Props = {
  open: boolean;
};

export default function LoadingOverlay({ open }: Props) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: "primary.main",
        zIndex: (theme) => theme.zIndex.modal + 1,
        bgcolor: "rgba(10,10,15,0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <CircularProgress color="inherit" thickness={4} size={56} />
    </Backdrop>
  );
}