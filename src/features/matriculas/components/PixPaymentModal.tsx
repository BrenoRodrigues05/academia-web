import { useState, useEffect } from "react";
import MatriculaService from "../api/MatriculaService";
import type { Matricula } from "../types";

interface PixPaymentModalProps {
    matriculaData: Matricula & { dataExpiracao?: string };
    onClose: () => void;
    onSuccess: () => void;
    }

    export function PixPaymentModal({
    matriculaData,
    onClose,
    onSuccess,
    }: PixPaymentModalProps) {
    const [copied, setCopied] = useState(false);
    const [, setIsVerifying] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState<boolean>(false);

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

    const handleCopyPix = () => {
        if (isExpired) return;
        navigator.clipboard.writeText(matriculaData.pixCopiaECola);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    useEffect(() => {
        if (isExpired) return;

        const interval = setInterval(async () => {
        try {
            setIsVerifying(true);
            const result = await MatriculaService.findById(
            matriculaData.matricula
            );

            if (result && result.ativa) {
            clearInterval(interval);
            onSuccess();
            }
        } catch (error) {
            console.error("Erro ao verificar status do pagamento", error);
        } finally {
            setIsVerifying(false);
        }
        }, 5000);

        return () => clearInterval(interval);
    }, [matriculaData.matricula, onSuccess, isExpired]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 text-white shadow-xl border border-slate-800 text-center">
            <h2 className="text-xl font-bold text-emerald-400">Pagamento via Pix</h2>
            <p className="text-sm text-slate-400 mt-1">
            Escaneie o QR Code ou copie o código Pix abaixo para ativar sua
            matrícula.
            </p>

            <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono font-semibold transition-colors ${
                isExpired
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                : timeLeft < 300
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                : "bg-slate-800 text-emerald-400 border border-slate-700"
            }`}
            >
            <span>⏱️</span>
            {isExpired ? (
                <span>QR CODE EXPIRADO</span>
            ) : (
                <span>Pix expira em: {formatTime(timeLeft)}</span>
            )}
            </div>

            <div className="relative my-5 flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-inner">
            <img
                src={`data:image/png;base64,${matriculaData.qrCodeBase64}`}
                alt="QR Code Pix"
                className={`h-52 w-52 object-contain transition-all ${
                isExpired ? "opacity-15 blur-xs" : ""
                }`}
            />

            {isExpired && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 p-4 rounded-xl text-center">
                <span className="text-2xl mb-1">⏳</span>
                <p className="text-sm font-semibold text-rose-400">
                    Código expirado
                </p>
                <p className="text-xs text-slate-300 mt-1">
                    Feche este modal e gere uma nova cobrança para continuar.
                </p>
                </div>
            )}
            </div>

            <div className="space-y-3">
            <button
                onClick={handleCopyPix}
                disabled={isExpired}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all ${
                isExpired
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95"
                }`}
            >
                {copied ? "✅ Copiado!" : "📋 Copiar Chave Pix Copia e Cola"}
            </button>

            <button
                onClick={onClose}
                className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
            >
                {isExpired ? "Fechar" : "Fechar e Pagar Mais Tarde"}
            </button>
            </div>

            {!isExpired ? (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Aguardando confirmação do pagamento...
            </div>
            ) : (
            <div className="mt-4 text-xs text-rose-400">
                A verificação automática foi pausada devido à expiração.
            </div>
            )}
        </div>
        </div>
    );
}