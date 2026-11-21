import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  alpha,
} from "@mui/material";
import {
  BlockOutlined,
  InfoOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

type Severity = "warning" | "error" | "info";

type Props = {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  severity?: Severity;
  onConfirm: () => void;
  onCancel: () => void;
};

const config: Record<Severity, { icon: React.ReactNode; color: "primary" | "warning" | "error" }> = {
  info: { icon: <InfoOutlined sx={{ fontSize: 40 }} />, color: "primary" },
  warning: { icon: <WarningAmberOutlined sx={{ fontSize: 40 }} />, color: "warning" },
  error: { icon: <BlockOutlined sx={{ fontSize: 40 }} />, color: "error" },
};

export default function ConfirmDialog({
  open,
  title,
  message,
  loading = false,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  severity = "info",
  onConfirm,
  onCancel,
}: Props) {
  const { icon, color } = config[severity];

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundImage: "none",
            pt: 2,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: `${color}.main`,
            bgcolor: (t) => alpha(t.palette[color].main, 0.12),
            boxShadow: (t) => `0 0 0 8px ${alpha(t.palette[color].main, 0.06)}`,
          }}
        >
          {icon}
        </Box>
      </Box>

      <DialogTitle sx={{ textAlign: "center", fontWeight: 800, pb: 1 }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ textAlign: "center", color: "text.secondary" }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          color="inherit"
          fullWidth
          sx={{ py: 1.1 }}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          color={color}
          fullWidth
          sx={{ py: 1.1, m: 0 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}