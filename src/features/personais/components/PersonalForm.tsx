import { Grid, InputAdornment } from "@mui/material";
import {
    BadgeOutlined,
    FitnessCenterOutlined,
    MailOutlined,
    PhoneOutlined,
    WorkspacePremiumOutlined,
    } from "@mui/icons-material";
    import { Controller, useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";

    import { personalSchema, type PersonalSchema } from "../validation/personalSchema";
    import { Sexo } from "../../../shared/enums/Sexo";

    import {
    AppTextField,
    AppSelectField,
    AppPhoneField,
    } from "@/components/forms";

    type Props = {
    defaultValues?: Partial<PersonalSchema>;
    onSubmit: (data: PersonalSchema) => void;
    isEditing?: boolean;
    };

    const sexoOptions = [
    { value: Sexo.MASCULINO, label: "Masculino" },
    { value: Sexo.FEMININO, label: "Feminino" },
    ];

    const withIcon = (icon: React.ReactNode) => ({
    input: {
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
    },
    });

    const iconSx = { color: "text.secondary", fontSize: 20 };

    export default function PersonalForm({
    defaultValues,
    onSubmit,
    isEditing,
    }: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PersonalSchema>({
        resolver: zodResolver(personalSchema),
        defaultValues,
    });

    const isEditMode = isEditing ?? Boolean(defaultValues?.email);

    return (
        <form id="crud-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
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
                name="sobrenome"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="Sobrenome"
                    autoComplete="off"
                    error={!!errors.sobrenome}
                    helperText={errors.sobrenome?.message}
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

            <Grid size={{ xs: 12, md: 4 }}>
            <Controller
                name="cref"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="CREF"
                    autoComplete="off"
                    error={!!errors.cref}
                    helperText={errors.cref?.message}
                    slotProps={withIcon(<WorkspacePremiumOutlined sx={iconSx} />)}
                />
                )}
            />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
            <Controller
                name="especialidade"
                control={control}
                render={({ field }) => (
                <AppTextField
                    {...field}
                    label="Especialidade"
                    autoComplete="off"
                    error={!!errors.especialidade}
                    helperText={errors.especialidade?.message}
                    slotProps={withIcon(<FitnessCenterOutlined sx={iconSx} />)}
                />
                )}
            />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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