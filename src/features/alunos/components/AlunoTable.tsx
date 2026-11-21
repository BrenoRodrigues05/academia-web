import CrudTable from "@/components/crud/CrudTable";
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Aluno } from "../types/Aluno";
import { Box, Chip, Typography } from "@mui/material";
import { Circle } from "@mui/icons-material";

type Props = {
  alunos: Aluno[];
  onEdit?: (aluno: Aluno) => void;
  onDelete?: (aluno: Aluno) => void;
  onDeactivate?: (aluno: Aluno) => void;
};

const formatSexo = (sexo?: string) =>
  sexo ? sexo.charAt(0).toUpperCase() + sexo.slice(1).toLowerCase() : "—";

export default function AlunoTable({
  alunos,
  onEdit,
  onDelete,
  onDeactivate,
}: Props) {
  const columns: CrudColumn<Aluno>[] = [
    {
      field: "nome",
      header: "Nome",
      render: (aluno) => (
        <Box component="span" sx={{ fontWeight: 700 }}>
          {aluno.nome}
        </Box>
      ),
    },
    {
      field: "email",
      header: "E-mail",
      render: (aluno) => (
        <Typography component="span" variant="body2" color="text.secondary">
          {aluno.email}
        </Typography>
      ),
    },
    {
      field: "telefone",
      header: "Telefone",
      render: (aluno) => aluno.telefone || "—",
    },
    {
      field: "sexo",
      header: "Sexo",
      align: "center",
      render: (aluno) => (
        <Chip
          label={formatSexo(aluno.sexo)}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, minWidth: 80 }}
        />
      ),
    },
    {
      field: "usuario",
      header: "Status",
      align: "center",
      render: (aluno) => {
        const isAtivo = aluno.usuario?.ativo ?? false;
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
      render: (aluno) => (
        <CrudActions
          onEdit={() => onEdit?.(aluno)}
          onDelete={() => onDelete?.(aluno)}
          onDeactivate={onDeactivate ? () => onDeactivate(aluno) : undefined}
          isAtivo={aluno.usuario?.ativo ?? false}
        />
      ),
    },
  ];

  return (
    <CrudTable<Aluno>
      columns={columns}
      rows={alunos}
      rowKey={(aluno) => aluno.id}
    />
  );
}