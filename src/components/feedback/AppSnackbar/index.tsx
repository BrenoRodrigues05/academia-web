import { Alert, Snackbar, alpha } from "@mui/material";
import {
  CheckCircleOutlined,
  ErrorOutlined,
  InfoOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

type Props = {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  onClose: () => void;
};

const icons = {
  success: <CheckCircleOutlined />,
  error: <ErrorOutlined />,
  warning: <WarningAmberOutlined />,
  info: <InfoOutlined />,
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
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={onClose}
      sx={{ mt: 8 }}
    >
      <Alert
        severity={severity}
        variant="outlined"
        icon={icons[severity]}
        onClose={onClose}
        sx={(t) => ({
          width: "100%",
          minWidth: 280,
          alignItems: "center",
          borderRadius: 2,
          fontWeight: 600,
          color: t.palette.text.primary,
          bgcolor: "#13131A",
          backgroundImage: `linear-gradient(${alpha(
            t.palette[severity].main,
            0.12
          )}, ${alpha(t.palette[severity].main, 0.12)})`,
          borderColor: alpha(t.palette[severity].main, 0.5),
          borderLeft: `4px solid ${t.palette[severity].main}`,
          boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
          "& .MuiAlert-icon": { color: t.palette[severity].main },
        })}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}