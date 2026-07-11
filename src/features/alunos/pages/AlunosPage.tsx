import { useState } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material"; 
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
    create, 
    notification, 
    closeNotification, 
  } = useAlunos();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false); 

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
        loading={submitting} 
        onClose={() => !submitting && setOpen(false)}
        onSubmit={async (formData) => {
          setSubmitting(true);
          try {
            await create(formData); 
            setOpen(false); 
          } catch (error) {
            console.error("Falha na submissão:", error);
          } finally {
            setSubmitting(false);
          }
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

      <Snackbar
        open={notification.open}
        autoHideDuration={4000} 
        onClose={closeNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}