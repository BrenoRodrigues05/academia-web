import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
} from "@mui/material";

import type { Treino } from "../types";
import type { Personal } from "@/features/personais/types";

type Props = {
    open: boolean;
    treino: Treino | null;
    personais: Personal[];
    onClose: () => void;
    onConfirm: (treinoId: number, novoPersonalId: number) => Promise<void>;
};

export default function ReatribuirPersonalDialog({
    open,
    treino,
    personais,
    onClose,
    onConfirm,
}: Props) {
    const [selectedPersonalId, setSelectedPersonalId] = useState<number | "">("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSave() {
        if (!treino || !selectedPersonalId) return;

        setSubmitting(true);
        try {
            await onConfirm(treino.id, Number(selectedPersonalId));
            setSelectedPersonalId("");
            onClose();
        } finally {
            setSubmitting(false);
        }
    }

    function handleClose() {
        setSelectedPersonalId("");
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Reatribuir Personal</DialogTitle>
            
            <DialogContent>
                {treino && (
                    <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        Selecione o novo Personal responsável pelo treino{" "}
                        <strong>{treino.nome}</strong> (Aluno: {treino.nomeAluno || treino.aluno?.nome}).
                    </Typography>
                )}

                <TextField
                    select
                    fullWidth
                    label="Novo Personal Responsável"
                    value={selectedPersonalId}
                    onChange={(e) => setSelectedPersonalId(Number(e.target.value))}
                >
                    {personais
                        .filter((personal) => {
                            const currentPersonalId = treino?.personal?.id ?? (treino as any)?.personalId;
                            return personal.id !== currentPersonalId;
                        })
                        .map((personal) => (
                            <MenuItem key={personal.id} value={personal.id}>
                                {personal.nome}
                            </MenuItem>
                        ))}
                </TextField>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!selectedPersonalId || submitting}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}