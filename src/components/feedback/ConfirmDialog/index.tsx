import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BlockIcon from "@mui/icons-material/Block"; 

type Props = {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  severity?: "warning" | "error" | "info";
  onConfirm: () => void;
  onCancel: () => void;
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

  const getButtonColor = () => {
    if (severity === "error") return "error";      
    if (severity === "warning") return "warning";  
    return "primary";                            
  };

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
            padding: 1 
          }
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, fontWeight: "bold" }}>
        {severity === "error" && <BlockIcon color="error" fontSize="large" />}
        {severity === "warning" && <WarningAmberIcon color="warning" fontSize="large" />}
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: "text.secondary" }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          color="inherit"
          sx={{ fontWeight: "bold" }}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          disableElevation 
          color={getButtonColor()} 
          sx={{ fontWeight: "bold", borderRadius: 2 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}