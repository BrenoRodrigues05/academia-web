import CrudTable from "@/components/crud/CrudTable"; 
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Personal } from "../types/Personal";
import { Chip } from "@mui/material";

type Props = {
    personais: Personal[];
    onEdit?: (personal: Personal) => void;
    onDelete?: (personal: Personal) => void;
    onDeactivate?: (personal: Personal) => void;
    };

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
        render: (personal) => `${personal.nome} ${personal.sobrenome}`,
        },
        {
        field: "cref",
        header: "CREF",
        },
        {
        field: "especialidade",
        header: "Especialidade",
        },
        {
        field: "email",
        header: "Email",
        },
        {
        field: "telefone",
        header: "Telefone",
        },
        {
        field: "sexo",
        header: "Sexo",
        align: "center",
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
                variant="filled"
                sx={{ fontWeight: "bold", minWidth: 80 }}
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