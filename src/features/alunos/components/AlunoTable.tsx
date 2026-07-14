import CrudTable from "@/components/crud/CrudTable"; 
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Aluno } from "../types/Aluno";
import { Chip } from "@mui/material";

type Props = {
  alunos: Aluno[];
  onEdit?: (aluno: Aluno) => void;
  onDelete?: (aluno: Aluno) => void;
  onDeactivate?: (aluno: Aluno) => void;
};

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