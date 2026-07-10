import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  IconButton,
  Stack,
} from "@mui/material";

import { AppTable } from "@/components/ui";

import type { Aluno } from "../types/Aluno";

type Props = {
  alunos: Aluno[];
};

export default function AlunoTable({
  alunos,
}: Props) {

  const columns = [
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
      align: "center" as const,
    },
    {
      field: "id",
      header: "Ações",
      align: "center" as const,
      render: (aluno: Aluno) => (
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <IconButton>
            <EditIcon />
          </IconButton>

          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ] as const; 

  return (
    <AppTable
      columns={columns as any} 
      rows={alunos}
    />
  );
}