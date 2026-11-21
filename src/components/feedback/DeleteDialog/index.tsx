import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";

type Props = {
  open: boolean;
  entityName: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteDialog({
  open,
  entityName,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
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
            color: "error.main",
            bgcolor: (t) => alpha(t.palette.error.main, 0.12),
            boxShadow: (t) => `0 0 0 8px ${alpha(t.palette.error.main, 0.06)}`,
          }}
        >
          <DeleteOutlined sx={{ fontSize: 40 }} />
        </Box>
      </Box>

      <DialogTitle sx={{ textAlign: "center", fontWeight: 800, pb: 1 }}>
        Excluir registro
      </DialogTitle>

      <DialogContent>
        <Typography align="center" color="text.secondary">
          Deseja realmente excluir{" "}
          <Box component="strong" sx={{ color: "text.primary" }}>
            {entityName}
          </Box>
          ? Essa ação não pode ser desfeita.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          color="inherit"
          fullWidth
          sx={{ py: 1.1 }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          fullWidth
          sx={{ py: 1.1, m: 0 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Excluir"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}