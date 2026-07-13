import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack } from "@mui/material";

import CrudTable from "@/components/crud/CrudTable"; 
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
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "center" }}
        >
          <IconButton 
            color="primary" 
            onClick={() => onEdit?.(aluno)}
            aria-label="Editar aluno"
          >
            <EditIcon />
          </IconButton>

          <IconButton 
            color="error" 
            onClick={() => onDelete?.(aluno)}
            aria-label="Deletar aluno"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
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