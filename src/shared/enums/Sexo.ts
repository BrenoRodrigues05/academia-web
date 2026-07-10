export const Sexo = {
    MASCULINO: "MASCULINO",
    FEMININO: "FEMININO",
} as const;

export type Sexo = (typeof Sexo)[keyof typeof Sexo];