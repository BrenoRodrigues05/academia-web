import { Box, Chip, Typography } from "@mui/material";
import { Circle } from "@mui/icons-material";

import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Matricula } from "../types";

interface MatriculasTableProps {
    matriculas: Matricula[];
    onEdit: (matricula: Matricula) => void;
    onToggleStatus: (matricula: Matricula) => void;
    }

    export default function MatriculasTable({
    matriculas,
    onEdit,
    onToggleStatus,
    }: MatriculasTableProps) {
    const columns: CrudColumn<Matricula>[] = [
        {
        field: "aluno",
        header: "Aluno",
        render: (matricula) => (
            <Box component="span" sx={{ fontWeight: 700 }}>
            {matricula.aluno?.nome ?? "—"}
            </Box>
        ),
        },
        {
        field: "plano",
        header: "Plano",
        render: (matricula) => matricula.plano?.nome ?? "—",
        },
        {
        field: "matricula",
        header: "Nº",
        width: 90,
        render: (matricula) => (
            <Typography component="span" variant="body2" color="text.secondary">
            #{matricula.matricula}
            </Typography>
        ),
        },
        {
        field: "ativa",
        header: "Status",
        align: "center",
        render: (matricula) => (
            <Chip
            label={matricula.ativa ? "Ativa" : "Inativa"}
            size="small"
            color={matricula.ativa ? "success" : "default"}
            variant="outlined"
            icon={<Circle sx={{ fontSize: "8px !important" }} />}
            sx={{ fontWeight: 700, minWidth: 90 }}
            />
        ),
        },
        {
        field: "matricula",
        header: "Ações",
        align: "center",
        width: 120,
        render: (matricula) => (
            <CrudActions
            onEdit={() => onEdit(matricula)}
            onDeactivate={() => onToggleStatus(matricula)}
            isAtivo={matricula.ativa}
            />
        ),
        },
    ];

    return (
        <CrudTable<Matricula>
        columns={columns}
        rows={matriculas}
        rowKey={(matricula) => matricula.matricula}
        />
    );
}