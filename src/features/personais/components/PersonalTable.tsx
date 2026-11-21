import { Box, Chip, Typography } from "@mui/material";
import { Circle } from "@mui/icons-material";

import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Personal } from "../types/Personal";

type Props = {
    personais: Personal[];
    onEdit?: (personal: Personal) => void;
    onDelete?: (personal: Personal) => void;
    onDeactivate?: (personal: Personal) => void;
    };

    const formatSexo = (sexo?: string) =>
    sexo ? sexo.charAt(0).toUpperCase() + sexo.slice(1).toLowerCase() : "—";

    export default function PersonalTable({
    personais,
    onEdit,
    onDelete,
    onDeactivate,
    }: Props) {
    const columns: CrudColumn<Personal>[] = [
        {
        field: "nome",
        header: "Nome",
        render: (personal) => (
            <Box component="span" sx={{ fontWeight: 700 }}>
            {`${personal.nome} ${personal.sobrenome}`}
            </Box>
        ),
        },
        {
        field: "cref",
        header: "CREF",
        render: (personal) => (
            <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 600, letterSpacing: 0.5 }}
            >
            {personal.cref || "—"}
            </Typography>
        ),
        },
        {
        field: "especialidade",
        header: "Especialidade",
        render: (personal) =>
            personal.especialidade ? (
            <Chip
                label={personal.especialidade}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
            />
            ) : (
            "—"
            ),
        },
        {
        field: "email",
        header: "E-mail",
        render: (personal) => (
            <Typography component="span" variant="body2" color="text.secondary">
            {personal.email}
            </Typography>
        ),
        },
        {
        field: "telefone",
        header: "Telefone",
        render: (personal) => personal.telefone || "—",
        },
        {
        field: "sexo",
        header: "Sexo",
        align: "center",
        render: (personal) => (
            <Chip
            label={formatSexo(personal.sexo)}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, minWidth: 80 }}
            />
        ),
        },
        {
        field: "ativo",
        header: "Status",
        align: "center",
        render: (personal) => {
            const isAtivo = personal.ativo ?? false;
            return (
            <Chip
                label={isAtivo ? "Ativo" : "Inativo"}
                size="small"
                color={isAtivo ? "success" : "error"}
                variant="outlined"
                icon={<Circle sx={{ fontSize: "8px !important" }} />}
                sx={{ fontWeight: 700, minWidth: 90 }}
            />
            );
        },
        },
        {
        field: "id",
        header: "Ações",
        align: "center",
        width: 160,
        render: (personal) => (
            <CrudActions
            onEdit={() => onEdit?.(personal)}
            onDelete={() => onDelete?.(personal)}
            onDeactivate={onDeactivate ? () => onDeactivate(personal) : undefined}
            isAtivo={personal.ativo ?? false}
            />
        ),
        },
    ];

    return (
        <CrudTable<Personal>
        columns={columns}
        rows={personais}
        rowKey={(personal) => personal.id}
        />
    );
}