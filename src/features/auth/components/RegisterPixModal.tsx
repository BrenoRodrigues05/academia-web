import { useState, useEffect, useRef } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    Typography,
    alpha,
    keyframes,
    } from "@mui/material";
    import {
    CheckCircleOutlined,
    ContentCopy,
    Pix,
    } from "@mui/icons-material";
    import MatriculaService from "@/features/matriculas/api/MatriculaService";
    import type { RegisterPixResponse } from "../types/types";

    interface RegisterPixModalProps {
    open: boolean;
    pixData: RegisterPixResponse | null;
    onPaymentApproved: () => void;
    onClose: () => void;
    }

    const pulse = keyframes`
    0%   { box-shadow: 0 0 0 0 rgba(198,255,61,0.6); }
    70%  { box-shadow: 0 0 0 10px rgba(198,255,61,0); }
    100% { box-shadow: 0 0 0 0 rgba(198,255,61,0); }
    `;

    export default function RegisterPixModal({
    open,
    pixData,
    onPaymentApproved,
    onClose,
    }: RegisterPixModalProps) {
    const [copied, setCopied] = useState(false);

    const onApprovedRef = useRef(onPaymentApproved);
    useEffect(() => {
        onApprovedRef.current = onPaymentApproved;
    }, [onPaymentApproved]);

    const handleCopy = async () => {
        if (!pixData?.pixCopiaECola) return;
        try {
        await navigator.clipboard.writeText(pixData.pixCopiaECola);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        } catch (err) {
        console.error("Não foi possível copiar o código Pix:", err);
        }
    };

    useEffect(() => {
        if (!open || !pixData?.matricula) return;

        const interval = setInterval(async () => {
        try {
            const statusMatricula = await MatriculaService.findById(
            pixData.matricula
            );
            if (statusMatricula && statusMatricula.ativa) {
            clearInterval(interval);
            onApprovedRef.current();
            }
        } catch (err) {
            console.error("Aguardando confirmação do pagamento...", err);
        }
        }, 3000);

        return () => clearInterval(interval);
    }, [open, pixData]);

    if (!pixData) return null;

    return (
        <Dialog
        open={open}
        maxWidth="xs"
        fullWidth
        slotProps={{
            paper: {
            sx: {
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundImage: "none",
            },
            },
        }}
        >
        <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2.5,
            }}
            >
            <Box
                sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "primary.main",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                boxShadow: (t) =>
                    `0 0 0 8px ${alpha(t.palette.primary.main, 0.06)}`,
                }}
            >
                <Pix sx={{ fontSize: 36 }} />
            </Box>

            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Pagamento da matrícula
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Escaneie o QR Code ou copie o código para pagar no app do seu
                banco.
                </Typography>
            </Box>

            <Box
                sx={{
                p: 1.5,
                bgcolor: "#fff",
                borderRadius: 3,
                boxShadow: "0 0 0 1px rgba(198,255,61,0.35), 0 12px 32px rgba(0,0,0,0.4)",
                lineHeight: 0,
                }}
            >
                <Box
                component="img"
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code Pix"
                sx={{ width: 220, height: 220, display: "block" }}
                />
            </Box>

            <Button
                variant="contained"
                color={copied ? "success" : "primary"}
                fullWidth
                size="large"
                startIcon={copied ? <CheckCircleOutlined /> : <ContentCopy />}
                onClick={handleCopy}
                sx={{ py: 1.5 }}
            >
                {copied ? "Código copiado!" : "Copiar Pix copia e cola"}
            </Button>

            <Alert
                severity="info"
                variant="outlined"
                sx={{ width: "100%", borderRadius: 2 }}
            >
                Sua conta será ativada automaticamente assim que o pagamento for
                confirmado.
            </Alert>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    animation: `${pulse} 1.6s infinite`,
                }}
                />
                <Typography variant="body2" color="text.secondary">
                Aguardando confirmação do pagamento...
                </Typography>
            </Box>

            <Button color="inherit" size="small" onClick={onClose}>
                Concluir mais tarde
            </Button>
            </Box>
        </DialogContent>
        </Dialog>
    );
}