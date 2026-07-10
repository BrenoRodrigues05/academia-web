import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Props = {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
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
  onConfirm,
  onCancel,
}: Props) {

  return (

    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
    >

      <DialogTitle>

        {title}

      </DialogTitle>

      <DialogContent>

        <DialogContentText>

          {message}

        </DialogContentText>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onCancel}
          disabled={loading}
        >

          {cancelText}

        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >

          {confirmText}

        </Button>

      </DialogActions>

    </Dialog>

  );

}