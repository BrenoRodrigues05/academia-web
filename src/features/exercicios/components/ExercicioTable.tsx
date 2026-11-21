import { Box, Chip, Typography } from "@mui/material";

import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Exercicio } from "../types";
import { GrupoMuscularLabel } from "@/shared/enums/GrupoMuscularLabel";

type Props = {
    exercicios: Exercicio[];
    onEdit: (exercicio: Exercicio) => void;
    onDelete: (exercicio: Exercicio) => void;
    };

    export default function ExercicioTable({
    exercicios,
    onEdit,
    onDelete,
    }: Props) {
    const columns: CrudColumn<Exercicio>[] = [
        {
        field: "nome",
        header: "Nome",
        render: (exercicio) => (
            <Box component="span" sx={{ fontWeight: 700 }}>
            {exercicio.nome}
            </Box>
        ),
        },
        {
        field: "grupoMuscular",
        header: "Grupo Muscular",
        render: (exercicio) => (
            <Chip
            label={GrupoMuscularLabel[exercicio.grupoMuscular]}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
            />
        ),
        },
        {
        field: "descricao",
        header: "Descrição",
        render: (exercicio) => (
            <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            title={exercicio.descricao}
            sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                maxWidth: 420,
            }}
            >
            {exercicio.descricao || "—"}
            </Typography>
        ),
        },
        {
        field: "id",
        header: "Ações",
        align: "center",
        width: 120,
        render: (exercicio) => (
            <CrudActions
            onEdit={() => onEdit(exercicio)}
            onDelete={() => onDelete(exercicio)}
            />
        ),
        },
    ];

    return (
        <CrudTable<Exercicio>
        columns={columns}
        rows={exercicios}
        rowKey={(exercicio) => exercicio.id}
        />
    );
}