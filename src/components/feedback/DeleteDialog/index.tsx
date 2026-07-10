import DeleteIcon from "@mui/icons-material/Delete"; 

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

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
    >
      <DialogTitle>
        Excluir registro
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <DeleteIcon
            color="error"
            sx={{
              fontSize: 64,
            }}
          />
        </Box>

        <Typography
          align="center"
        >
          Deseja realmente excluir{" "}
          <strong>
            {entityName}
          </strong>
          ?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}