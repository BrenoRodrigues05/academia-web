import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { personalSchema, type PersonalSchema } from "../validation/personalSchema";
import { Sexo } from "../../../shared/enums/Sexo";

import { 
    AppTextField, 
    AppSelectField, 
    AppPhoneField 
} from "@/components/forms";

type Props = {
    defaultValues?: Partial<PersonalSchema>;
    onSubmit: (data: PersonalSchema) => void;
};

const sexoOptions = [
    { value: Sexo.MASCULINO, label: "Masculino" },
    { value: Sexo.FEMININO, label: "Feminino" },
];

export default function PersonalForm({
    defaultValues,
    onSubmit,
}: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PersonalSchema>({
        resolver: zodResolver(personalSchema),
        defaultValues,
    });

    return (
        <form
            id="crud-form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container spacing={2}>
                
                <Grid size={{ xs: 12, md: 6 }}>
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
                        name="sobrenome"
                        control={control}
                        render={({ field }) => (
                            <AppTextField
                                {...field}
                                label="Sobrenome"
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

                <Grid size={{ xs: 12, md: 4 }}>
                    <Controller
                        name="cref"
                        control={control}
                        render={({ field }) => (
                            <AppTextField
                                {...field}
                                label="CREF"
                                error={!!errors.cref}
                                helperText={errors.cref?.message}
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
                                error={!!errors.especialidade}
                                helperText={errors.especialidade?.message}
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