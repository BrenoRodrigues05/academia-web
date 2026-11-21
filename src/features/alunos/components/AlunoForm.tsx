import { Grid, InputAdornment } from "@mui/material";
    import {
    BadgeOutlined,
    MailOutlined,
    PhoneOutlined,
    } from "@mui/icons-material";
    import { Controller, useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";

    import { alunoSchema } from "../validation/alunoSchema";
    import { Sexo } from "../../../shared/enums/Sexo";

    import {
    AppTextField,
    AppSelectField,
    AppDateField,
    AppPhoneField,
    } from "@/components/forms";

    import type { AlunoSchema } from "../validation/alunoSchema";

    type Props = {
    defaultValues?: Partial<AlunoSchema>;
    onSubmit: (data: AlunoSchema) => void;
    isEditing?: boolean;
    };

    const sexoOptions = [
    { value: Sexo.MASCULINO, label: "Masculino" },
    { value: Sexo.FEMININO, label: "Feminino" },
    ];

    const withIcon = (icon: React.ReactNode) => ({
    input: {
        startAdornment: (
        <InputAdornment position="start">{icon}</InputAdornment>
        ),
    },
    });

    const iconSx = { color: "text.secondary", fontSize: 20 };

    export default function AlunoForm({
    defaultValues,
    onSubmit,
    isEditing,
    }: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AlunoSchema>({
        resolver: zodResolver(alunoSchema),
        defaultValues,
    });

    const isEditMode = isEditing ?? Boolean(defaultValues?.email);

    return (
        <form id="crud-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
            <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="Nome"
                    autoComplete="off"
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                    slotProps={withIcon(<BadgeOutlined sx={iconSx} />)}
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
                    autoComplete="off"
                    disabled={isEditMode}
                    error={!!errors.email}
                    helperText={
                    errors.email?.message ??
                    (isEditMode ? "O e-mail não pode ser alterado." : undefined)
                    }
                    slotProps={withIcon(<MailOutlined sx={iconSx} />)}
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
                    slotProps={withIcon(<PhoneOutlined sx={iconSx} />)}
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