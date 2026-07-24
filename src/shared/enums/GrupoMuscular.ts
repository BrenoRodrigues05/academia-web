export const GrupoMuscular = {
    PEITORAL : "PEITORAL",
    COSTAS : "COSTAS",
    OMBROS : "OMBROS",
    BICEPS : "BICEPS",
    TRICEPS : "TRICEPS",
    ANTEBRACO : "ANTEBRACO",
    ABDOMEN : "ABDOMEN",
    GLUTEOS : "GLUTEOS",
    QUADRICEPS : "QUADRICEPS",
    POSTERIOR : "POSTERIOR",
    PANTURRILHAS : "PANTURRILHAS",
    CARDIO : "CARDIO"
} as const;

export type GrupoMuscular = (typeof GrupoMuscular)[keyof typeof GrupoMuscular];