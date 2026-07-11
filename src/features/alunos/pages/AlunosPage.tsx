import { useState } from "react";
import { Box, Button } from "@mui/material"; 
import AddIcon from "@mui/icons-material/Add"; 

import MainLayout from "@/layouts/MainLayout";
import {
  AppPageHeader,
  AppPagination,
  AppSearch,
  AppLoading,
} from "@/components/ui";

import AlunoTable from "../components/AlunoTable";
import useAlunos from "../hooks/useAlunos";
import AlunoDialog from "../components/AlunoDialog";

export default function AlunosPage() {
  const {
    data,
    loading,
    page,
    setPage,
  } = useAlunos();

  const [open, setOpen] = useState(false); 

  return (
    <MainLayout>
      <AppPageHeader
        title="Alunos"
        subtitle="Gerenciamento de alunos"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)} 
          >
            Novo Aluno
          </Button>
        }
      />

      <AlunoDialog
        open={open}
        title="Novo Aluno"
        onClose={() => setOpen(false)}
        onSubmit={async (data) => {
          console.log(data);
          setOpen(false); 
        }}
      />

      <Box sx={{ mb: 3 }}>
        <AppSearch
          placeholder="Pesquisar alunos"
          onSearch={(value) => {
            console.log(value);
          }}
        />
      </Box>

      {loading && <AppLoading />}

      {!loading && data && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <AlunoTable alunos={data.content} />
          
          <AppPagination
            page={page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            onChange={setPage}
          />
        </Box>
      )}
    </MainLayout>
  );
}