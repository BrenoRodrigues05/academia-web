import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { planoSchema } from "../validation/planoSchema";
import { TipoPlano } from "@/shared/enums/TipoPlano";
import { AppTextField, AppSelectField } from "@/components/forms";

import type { PlanoSchema } from "../validation/planoSchema";

type Props = {
    defaultValues?: Partial<PlanoSchema>;
    onSubmit: (data: PlanoSchema) => void;
};

const planoOptions = [
    { value: TipoPlano.MENSAL, label: "Mensal" },
    { value: TipoPlano.TRIMESTRAL, label: "Trimestral" },
    { value: TipoPlano.ANUAL, label: "Anual" },
];

export default function PlanoForm({ defaultValues, onSubmit }: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PlanoSchema>({
        resolver: zodResolver(planoSchema),
        defaultValues: {
            nome: "",
            descricao: "",
            valor: 0,
            tipo: TipoPlano.MENSAL,
            imagemUrl: "",
            ...defaultValues, 
        },
    });

    return (
        <form id="crud-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="nome"
                        control={control}
                        render={({ field }) => (
                            <AppTextField
                                {...field}
                                label="Nome"
                                error={!!errors.nome}
                                helperText={errors.nome?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="descricao"
                        control={control}
                        render={({ field }) => (
                            <AppTextField
                                {...field}
                                label="Descrição"
                                multiline 
                                rows={3}
                                error={!!errors.descricao}
                                helperText={errors.descricao?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="valor"
                        control={control}
                        render={({ field }) => (
                            <AppTextField
                                {...field}
                                label="Valor (R$)"
                                type="number" 
                                error={!!errors.valor}
                                helperText={errors.valor?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="tipo"
                        control={control}
                        render={({ field }) => (
                            <AppSelectField
                                {...field}
                                label="Tipo"
                                options={planoOptions}
                                error={!!errors.tipo}
                                helperText={errors.tipo?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="imagemUrl"
                        control={control}
                        render={({ field }) => (
                            <AppTextField
                                {...field}
                                label="URL da Imagem"
                                error={!!errors.imagemUrl}
                                helperText={errors.imagemUrl?.message}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </form>
    );
}