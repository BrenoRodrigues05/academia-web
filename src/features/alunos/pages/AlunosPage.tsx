import { useState } from "react";
import { Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material"; 

import CrudPage from "@/components/crud/CrudPage";
import {
  AppPagination,
  AppLoading,
} from "@/components/ui";
import CrudToolbar from "@/components/crud/CrudToolbar";
import AlunoTable from "../components/AlunoTable";
import useAlunos from "../hooks/useAlunos";
import AlunoDialog from "../components/AlunoDialog";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import type { Aluno } from "../types/Aluno"; 
import { Sexo } from "@/shared/enums/Sexo";

type SexoFilterType = "todos" | Sexo;

type StatusFilterType = "todos" | "ativos" | "inativos";

export default function AlunosPage() {
  const {
    data,
    loading,
    page,
    setPage,
    isSearching,
    searchByNome,
    searchByEmail,
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
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("todos");

  const [searchType, setSearchType] = useState<"nome" | "email">("nome");
  const [searchQuery, setSearchQuery] = useState("");

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alunoTarget, setAlunoTarget] = useState<Aluno | null>(null);

  const [sexoFilter, setSexoFilter] = useState<SexoFilterType>("todos");


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

  const handleDeactivateClick = (aluno: Aluno) => {
    if (!aluno || aluno.id === undefined) return;
    setAlunoTarget(aluno);
    setDeactivateDialogOpen(true);
  };

  const confirmDeactivate = async () => {
    if (!alunoTarget) return;
    try {
      await desativar(alunoTarget); 
    } catch (error) {
      console.error("Falha ao alterar status do aluno:", error);
    } finally {
      setDeactivateDialogOpen(false);
      setAlunoTarget(null);
    }
  };

  const handleDeleteClick = (aluno: Aluno) => {
    if (!aluno || aluno.id === undefined) return;
    setAlunoTarget(aluno);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!alunoTarget || alunoTarget.id === undefined) return;
    try {
      await remove(alunoTarget.id);
    } catch (error) {
      console.error("Falha ao deletar aluno:", error);
    } finally {
      setDeleteDialogOpen(false);
      setAlunoTarget(null);
    }
  };

  const handleSearch = (texto: string) => {
    setSearchQuery(texto);
    if (searchType === "nome") {
      searchByNome(texto);
    } else {
      searchByEmail?.(texto); 
    }
  };
  const handleSearchTypeChange = (novoTipo: "nome" | "email") => {
    setSearchType(novoTipo);
    if (searchQuery.trim()) {
      if (novoTipo === "nome") {
        searchByNome(searchQuery);
      } else {
        searchByEmail?.(searchQuery);
      }
    }
  };

  const filteredAlunos = (data && Array.isArray(data.content))
  ? data.content.filter((aluno) => {
      const passaStatus = statusFilter === "todos" 
        ? true 
        : (aluno.usuario?.ativo ?? false) === (statusFilter === "ativos");
      const passaSexo = sexoFilter === "todos" 
        ? true 
        : aluno.sexo === sexoFilter;

      return passaStatus && passaSexo;
    })
  : [];

  return (
    <>
      <CrudPage
        toolbar={
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <CrudToolbar
              title="Alunos"
              subtitle="Gerenciamento de alunos"
              searchPlaceholder={`Pesquisar por ${searchType}`}
              createLabel="Novo Aluno"
              onCreate={handleCreateOpen} 
              onSearch={handleSearch}
            />
          </Box>
          
          <Box sx={{ 
            display: "flex", 
            flexDirection: "row", 
            gap: 2,             
            width: "100%", 
            mt: -1,
            flexWrap: "wrap"      
          }}>
            <FormControl size="small" sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}>
              <InputLabel id="search-type-label">Buscar por</InputLabel>
              <Select
                labelId="search-type-label"
                value={searchType}
                label="Buscar por"
                onChange={(e) => handleSearchTypeChange(e.target.value as "nome" | "email")}
              >
                <MenuItem value="nome">Nome</MenuItem>
                <MenuItem value="email">E-mail</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}>
              <InputLabel id="status-filter-label">Status do Usuário</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status do Usuário"
                onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="ativos">Ativos</MenuItem>
                <MenuItem value="inativos">Inativos</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}>
              <InputLabel id="sexo-filter-label">Gênero</InputLabel>
              <Select
                labelId="sexo-filter-label"
                value={sexoFilter}
                label="Gênero"
                onChange={(e) => setSexoFilter(e.target.value as SexoFilterType)}
              >
                <MenuItem value="todos">Todos os gêneros</MenuItem>
                <MenuItem value={Sexo.MASCULINO}>Masculino</MenuItem>
                <MenuItem value={Sexo.FEMININO}>Feminino</MenuItem>
              </Select>
            </FormControl>
          </Box>
          </Box>
        }
        table={
          loading ? (
            <AppLoading />
          ) : data ? (
            <AlunoTable 
              alunos={filteredAlunos} 
              onEdit={handleEditOpen} 
              onDelete={handleDeleteClick}
              onDeactivate={handleDeactivateClick} 
            />
          ) : null
        }
        pagination={
          !loading && data && !isSearching ? (
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
      <ConfirmDialog
        open={deactivateDialogOpen}
        severity="warning" 
        title={alunoTarget?.usuario?.ativo ? "Desativar Aluno" : "Ativar Aluno"}
        message={`Deseja realmente ${alunoTarget?.usuario?.ativo ? "desativar" : "ativar"} o cadastro do aluno ${alunoTarget?.nome}?`}
        confirmText={alunoTarget?.usuario?.ativo ? "Desativar" : "Ativar"}
        onCancel={() => setDeactivateDialogOpen(false)}
        onConfirm={confirmDeactivate}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        severity="error" 
        title="Excluir Aluno Permanentemente"
        message={`ATENÇÃO: Deseja realmente excluir permanentemente o aluno ${alunoTarget?.nome}? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir"
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
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