import CrudTable from "@/components/crud/CrudTable"; 
import CrudActions from "@/components/crud/CrudActions";
import type { CrudColumn } from "@/components/crud/types";
import type { Aluno } from "../types/Aluno";

type Props = {
  alunos: Aluno[];
  onEdit?: (aluno: Aluno) => void;
  onDelete?: (aluno: Aluno) => void;
};

export default function AlunoTable({
  alunos,
  onEdit,
  onDelete,
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
      field: "id",
      header: "Ações",
      align: "center",
      width: 120,
      render: (aluno) => (
        <CrudActions
          onEdit={() => onEdit?.(aluno)}
          onDelete={() => onDelete?.(aluno)}
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