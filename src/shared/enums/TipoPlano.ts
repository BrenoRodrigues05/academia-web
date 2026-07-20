export const TipoPlano = {
    MENSAL: "MENSAL",
    TRIMESTRAL: "TRIMESTRAL",
    ANUAL: "ANUAL"
} as const;

export type TipoPlano = (typeof TipoPlano)[keyof typeof TipoPlano];