import {
  Alert,
  Snackbar,
} from "@mui/material";

export type SnackbarSeverity =
  | "success"
  | "error"
  | "warning"
  | "info";

type Props = {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  onClose: () => void;
};

export default function AppSnackbar({
  open,
  message,
  severity,
  onClose,
}: Props) {

  return (

    <Snackbar

      open={open}

      autoHideDuration={4000}

      anchorOrigin={{

        vertical: "top",

        horizontal: "right",

      }}

      onClose={onClose}

    >

      <Alert

        severity={severity}

        variant="filled"

        onClose={onClose}

        sx={{

          width: "100%",

        }}

      >

        {message}

      </Alert>

    </Snackbar>

  );

}