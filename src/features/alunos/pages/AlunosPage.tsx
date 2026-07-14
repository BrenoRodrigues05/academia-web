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
import type { Aluno } from "../types/Aluno"; 

export default function AlunosPage() {
  const {
    data,
    loading,
    page,
    setPage,
    create,
    update, 
    desativar,
    remove,
    notification, 
    closeNotification, 
  } = useAlunos();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const handleCreateOpen = () => {
    setSelectedAluno(null);
    setOpen(true);
  };

  const handleEditOpen = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setOpen(true);
  };

  const handleClose = () => {
    if (!submitting) {
      setOpen(false);
      setSelectedAluno(null);
    }
  };

  const handleDeactivate = async (aluno: Aluno) => {
  if (!aluno || aluno.id === undefined) {
    console.error("Erro: Objeto de aluno inválido ou ID inexistente!");
    return;
  }

  const statusAtual = aluno.usuario?.ativo ?? false;
  const acao = statusAtual ? "desativar" : "ativar";
  
  if (window.confirm(`Deseja realmente ${acao} o aluno ${aluno.nome}?`)) {
    try {
      await desativar(aluno); 
    } catch (error) {
      console.error(`Falha ao ${acao} aluno:`, error);
    }
  }
};

  const handleDelete = async (aluno: Aluno) => {
    if (window.confirm(`ATENÇÃO: Deseja realmente EXCLUIR PERMANENTEMENTE o aluno ${aluno.nome}? Essa ação não pode ser desfeita.`)) {
      try {
        await remove(aluno.id);
      } catch (error) {
        console.error("Falha ao deletar aluno:", error);
      }
    }
  };

  return (
    <>
      <CrudPage
        toolbar={
          <CrudToolbar
            title="Alunos"
            subtitle="Gerenciamento de alunos"
            searchPlaceholder="Pesquisar alunos"
            createLabel="Novo Aluno"
            onCreate={handleCreateOpen} 
            onSearch={console.log}
          />
        }
        table={
          loading ? (
            <AppLoading />
          ) : data ? (
            <AlunoTable 
              alunos={data.content} 
              onEdit={handleEditOpen} 
              onDelete={handleDelete} 
              onDeactivate={handleDeactivate} 
            />
          ) : null
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
            title={selectedAluno ? "Editar Aluno" : "Novo Aluno"}
            loading={submitting} 
            aluno={selectedAluno} 
            onClose={handleClose}
            onSubmit={async (formData) => {
              setSubmitting(true);
              try {
                if (selectedAluno) {
                  await update?.(selectedAluno.id, formData);
                } else {
                  await create(formData); 
                }
                handleClose(); 
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