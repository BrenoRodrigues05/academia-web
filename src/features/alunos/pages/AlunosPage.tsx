import { useState } from "react";
import { Snackbar, Alert } from "@mui/material"; 

import CrudPage from "@/components/crud/CrudPage";
import {
  AppPagination,
  AppLoading,
} from "@/components/ui";
import CrudToolbar from "@/components/crud/CrudToolbar";
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
    <>
      <CrudPage
        toolbar={
          <CrudToolbar
            title="Alunos"
            subtitle="Gerenciamento de alunos"
            searchPlaceholder="Pesquisar alunos"
            createLabel="Novo Aluno"
            onCreate={() => setOpen(true)} 
            onSearch={console.log}
          />
        }
        table={
          loading ? <AppLoading /> : data ? <AlunoTable alunos={data.content} /> : null
        }
        pagination={
          !loading && data ? (
            <AppPagination
              page={page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              onChange={setPage}
            />
          ) : undefined
        }
        dialogs={
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
        }
      />

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
    </>
  );
}