import { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    Typography,
    alpha,
    keyframes,
    } from "@mui/material";
    import {
    CheckCircleOutlined,
    ContentCopy,
    HourglassBottom,
    Pix,
    TimerOutlined,
    } from "@mui/icons-material";
    import MatriculaService from "../api/MatriculaService";
    import type { Matricula } from "../types";

    interface PixPaymentModalProps {
    matriculaData: Matricula & { dataExpiracao?: string };
    onClose: () => void;
    onSuccess: () => void;
    }

    const pulseDot = keyframes`
    0%   { box-shadow: 0 0 0 0 rgba(198,255,61,0.6); }
    70%  { box-shadow: 0 0 0 10px rgba(198,255,61,0); }
    100% { box-shadow: 0 0 0 0 rgba(198,255,61,0); }
    `;

    const blink = keyframes`
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.5; }
    `;

    export function PixPaymentModal({
    matriculaData,
    onClose,
    onSuccess,
    }: PixPaymentModalProps) {
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState<boolean>(false);

    const onSuccessRef = useRef(onSuccess);
    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    useEffect(() => {
        let targetTime: number;

        if (matriculaData.dataExpiracao) {
        targetTime = new Date(matriculaData.dataExpiracao).getTime();
        } else {
        targetTime = Date.now() + 30 * 60 * 1000;
        }

        const updateTimer = () => {
        const now = Date.now();
        const difference = Math.floor((targetTime - now) / 1000);

        if (difference <= 0) {
            setTimeLeft(0);
            setIsExpired(true);
        } else {
            setTimeLeft(difference);
        }
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        return () => clearInterval(timerInterval);
    }, [matriculaData.dataExpiracao]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    const handleCopyPix = async () => {
        if (isExpired) return;
        try {
        await navigator.clipboard.writeText(matriculaData.pixCopiaECola);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        } catch (error) {
        console.error("Não foi possível copiar o código Pix:", error);
        }
    };

    useEffect(() => {
        if (isExpired) return;

        const interval = setInterval(async () => {
        try {
            const result = await MatriculaService.findById(matriculaData.matricula);

            if (result && result.ativa) {
            clearInterval(interval);
            onSuccessRef.current();
            }
        } catch (error) {
            console.error("Erro ao verificar status do pagamento", error);
        }
        }, 5000);

        return () => clearInterval(interval);
    }, [matriculaData.matricula, isExpired]);

    const timerColor = isExpired ? "error" : timeLeft < 300 ? "warning" : "primary";

    return (
        <Dialog
        open
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
                boxShadow: (t) => `0 0 0 8px ${alpha(t.palette.primary.main, 0.06)}`,
                }}
            >
                <Pix sx={{ fontSize: 36 }} />
            </Box>

            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Pagamento via Pix
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Escaneie o QR Code ou copie o código Pix para ativar a matrícula.
                </Typography>
            </Box>

            <Chip
                icon={<TimerOutlined />}
                color={timerColor}
                variant="outlined"
                label={
                isExpired
                    ? "QR Code expirado"
                    : `Pix expira em ${formatTime(timeLeft)}`
                }
                sx={{
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                animation:
                    !isExpired && timeLeft < 300 ? `${blink} 1.2s infinite` : "none",
                }}
            />

            <Box
                sx={{
                position: "relative",
                p: 1.5,
                bgcolor: "#fff",
                borderRadius: 3,
                boxShadow: "0 0 0 1px rgba(198,255,61,0.35), 0 12px 32px rgba(0,0,0,0.4)",
                lineHeight: 0,
                }}
            >
                <Box
                component="img"
                src={`data:image/png;base64,${matriculaData.qrCodeBase64}`}
                alt="QR Code Pix"
                sx={{
                    width: 220,
                    height: 220,
                    display: "block",
                    objectFit: "contain",
                    opacity: isExpired ? 0.12 : 1,
                    filter: isExpired ? "blur(3px)" : "none",
                    transition: "all .3s",
                }}
                />

                {isExpired && (
                <Box
                    sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 3,
                    bgcolor: "rgba(10,10,15,0.88)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    p: 3,
                    lineHeight: 1.4,
                    }}
                >
                    <HourglassBottom sx={{ fontSize: 36, color: "error.main", mb: 1 }} />
                    <Typography sx={{ fontWeight: 800, color: "error.main" }}>
                    Código expirado
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Feche e gere uma nova cobrança para continuar.
                    </Typography>
                </Box>
                )}
            </Box>

            <Button
                variant="contained"
                color={copied ? "success" : "primary"}
                fullWidth
                size="large"
                disabled={isExpired}
                startIcon={copied ? <CheckCircleOutlined /> : <ContentCopy />}
                onClick={handleCopyPix}
                sx={{ py: 1.5 }}
            >
                {copied ? "Código copiado!" : "Copiar Pix copia e cola"}
            </Button>

            {isExpired ? (
                <Typography variant="caption" sx={{ color: "error.main" }}>
                A verificação automática foi pausada devido à expiração.
                </Typography>
            ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    animation: `${pulseDot} 1.6s infinite`,
                    }}
                />
                <Typography variant="body2" color="text.secondary">
                    Aguardando confirmação do pagamento...
                </Typography>
                </Box>
            )}

            <Button color="inherit" size="small" onClick={onClose}>
                {isExpired ? "Fechar" : "Fechar e pagar mais tarde"}
            </Button>
            </Box>
        </DialogContent>
        </Dialog>
    );
}