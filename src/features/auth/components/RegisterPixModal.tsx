import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    } from "@mui/material";
    import ContentCopyIcon from "@mui/icons-material/ContentCopy";
    import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"; 
    import MatriculaService from "@/features/matriculas/api/MatriculaService";
    import type { RegisterPixResponse } from "../types/types";

    interface RegisterPixModalProps {
    open: boolean;
    pixData: RegisterPixResponse | null;
    onPaymentApproved: () => void;
    onClose: () => void;
    }

    export default function RegisterPixModal({
    open,
    pixData,
    onPaymentApproved,
    onClose,
    }: RegisterPixModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (pixData?.pixCopiaECola) {
        navigator.clipboard.writeText(pixData.pixCopiaECola);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        }
    };

    useEffect(() => {
        if (!open || !pixData?.matricula) return;

        const interval = setInterval(async () => {
        try {
            const statusMatricula = await MatriculaService.findById(pixData.matricula);
            if (statusMatricula && statusMatricula.ativa) {
            clearInterval(interval);
            onPaymentApproved();
            }
        } catch (err) {
            console.error("Aguardando confirmação do pagamento...", err);
        }
        }, 3000);

        return () => clearInterval(interval);
    }, [open, pixData, onPaymentApproved]);

    if (!pixData) return null;

    return (
        <Dialog open={open} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            Pagamento da Matrícula 💳
        </DialogTitle>
        <DialogContent>
            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                my: 1,
            }}
            >
            <Alert severity="info" sx={{ width: "100%" }}>
                Sua conta será ativada automaticamente assim que o pagamento Pix for confirmado.
            </Alert>

            <Box
                component="img"
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code Pix"
                sx={{ width: 220, height: 220, borderRadius: 2, border: "1px solid #ddd" }}
            />

            <Button
                variant="contained"
                color={copied ? "success" : "primary"}
                fullWidth
                startIcon={copied ? <CheckCircleOutlinedIcon /> : <ContentCopyIcon />}
                onClick={handleCopy}
                sx={{ py: 1.5 }}
            >
                {copied ? "Código Copiado!" : "Copiar Pix Copia e Cola"}
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                Aguardando confirmação do pagamento...
                </Typography>
            </Box>

            <Button color="inherit" size="small" onClick={onClose} sx={{ mt: 1 }}>
                Concluir mais tarde
            </Button>
            </Box>
        </DialogContent>
        </Dialog>
    );
}