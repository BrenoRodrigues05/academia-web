import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { alunoSchema } from "../validation/alunoSchema";
import { Sexo } from "../../../shared/enums/Sexo";

import { 
    AppTextField, 
    AppSelectField, 
    AppDateField, 
    AppPhoneField 
    } from "@/components/forms";

    import type { AlunoSchema } from "../validation/alunoSchema";

    type Props = {
    defaultValues?: Partial<AlunoSchema>;
    onSubmit: (data: AlunoSchema) => void;
    };

    const sexoOptions = [
    { value: Sexo.MASCULINO, label: "Masculino" },
    { value: Sexo.FEMININO, label: "Feminino" },
    ];

    export default function AlunoForm({
    defaultValues,
    onSubmit,
    }: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AlunoSchema>({
        resolver: zodResolver(alunoSchema),
        defaultValues,
    });

    return (
        <form
        id="crud-form"
        onSubmit={handleSubmit(onSubmit)}
        >
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

            <Grid size={{ xs: 12, md: 6 }}>
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="E-mail"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                )}
            />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
            <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                <AppPhoneField
                    {...field}
                    label="Telefone"
                    error={!!errors.telefone}
                    helperText={errors.telefone?.message}
                />
                )}
            />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
            <Controller
                name="dataNascimento"
                control={control}
                render={({ field }) => (
                <AppDateField
                    {...field}
                    label="Data de nascimento"
                    error={!!errors.dataNascimento}
                    helperText={errors.dataNascimento?.message}
                />
                )}
            />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
            <Controller
                name="sexo"
                control={control}
                render={({ field }) => (
                <AppSelectField
                    {...field}
                    label="Sexo"
                    options={sexoOptions}
                    error={!!errors.sexo}
                    helperText={errors.sexo?.message}
                />
                )}
            />
            </Grid>
        </Grid>
        </form>
    );
}