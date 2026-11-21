import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FilterAlt, FilterAltOff } from "@mui/icons-material";

import CrudPage from "@/components/crud/CrudPage";
import CrudToolbar from "@/components/crud/CrudToolbar";
import {
  AppPagination,
  AppLoading,
  AppSearch,
} from "@/components/ui";
import { AppSelectField } from "@/components/forms";
import {AppSnackbar} from "@/components/feedback";
import {
  LoadingOverlay,
  EmptyState,
  ErrorState,
} from "@/components/feedback";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import { AlunoDialog, AlunoTable } from "../components";
import useAlunos from "../hooks/useAlunos";
import type { Aluno } from "../types/Aluno";
import { Sexo } from "@/shared/enums/Sexo";

type SearchType = "nome" | "email";
type SexoFilterType = "todos" | Sexo;
type StatusFilterType = "todos" | "ativos" | "inativos";
type IdadeFilterType = "todos" | "menor_18" | "18_25" | "26_40" | "mais_40";

const searchTypeOptions = [
  { value: "nome", label: "Nome" },
  { value: "email", label: "E-mail" },
];

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "ativos", label: "Ativos" },
  { value: "inativos", label: "Inativos" },
];

const sexoOptions = [
  { value: "todos", label: "Todos os gêneros" },
  { value: Sexo.MASCULINO, label: "Masculino" },
  { value: Sexo.FEMININO, label: "Feminino" },
];

const idadeOptions = [
  { value: "todos", label: "Todas as idades" },
  { value: "menor_18", label: "Menores de 18 anos" },
  { value: "18_25", label: "18 a 25 anos" },
  { value: "26_40", label: "26 a 40 anos" },
  { value: "mais_40", label: "Mais de 40 anos" },
];

const calcularIdade = (dataNascimentoString: string | undefined): number => {
  if (!dataNascimentoString) return 0;

  const hoje = new Date();
  const nascimento = new Date(dataNascimentoString);

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
};

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
  const [confirming, setConfirming] = useState(false);

  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const [searchType, setSearchType] = useState<SearchType>("nome");
  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("todos");
  const [sexoFilter, setSexoFilter] = useState<SexoFilterType>("todos");
  const [idadeFilter, setIdadeFilter] = useState<IdadeFilterType>("todos");

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alunoTarget, setAlunoTarget] = useState<Aluno | null>(null);

  const hasFilters =
    statusFilter !== "todos" || sexoFilter !== "todos" || idadeFilter !== "todos";

  const clearFilters = () => {
    setStatusFilter("todos");
    setSexoFilter("todos");
    setIdadeFilter("todos");
  };

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
    setConfirming(true);
    try {
      await desativar(alunoTarget);
    } catch (error) {
      console.error("Falha ao alterar status do aluno:", error);
    } finally {
      setConfirming(false);
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
    setConfirming(true);
    try {
      await remove(alunoTarget.id);
    } catch (error) {
      console.error("Falha ao deletar aluno:", error);
    } finally {
      setConfirming(false);
      setDeleteDialogOpen(false);
      setAlunoTarget(null);
    }
  };

  const runSearch = (texto: string, tipo: SearchType) => {
    if (tipo === "nome") {
      searchByNome(texto);
    } else {
      searchByEmail?.(texto);
    }
  };

  const handleSearch = (texto: string) => {
    if (texto === searchQuery) return;
    setSearchQuery(texto);
    runSearch(texto, searchType);
  };

  const handleSearchTypeChange = (novoTipo: SearchType) => {
    setSearchType(novoTipo);
    if (searchQuery.trim()) {
      runSearch(searchQuery, novoTipo);
    }
  };

  const filteredAlunos =
    data && Array.isArray(data.content)
      ? data.content.filter((aluno) => {
          const passaStatus =
            statusFilter === "todos"
              ? true
              : (aluno.usuario?.ativo ?? false) === (statusFilter === "ativos");

          const passaSexo =
            sexoFilter === "todos" ? true : aluno.sexo === sexoFilter;

          const idade = calcularIdade(aluno.dataNascimento);

          let passaIdade = true;
          if (idadeFilter === "menor_18") passaIdade = idade < 18;
          else if (idadeFilter === "18_25") passaIdade = idade >= 18 && idade <= 25;
          else if (idadeFilter === "26_40") passaIdade = idade >= 26 && idade <= 40;
          else if (idadeFilter === "mais_40") passaIdade = idade > 40;

          return passaStatus && passaSexo && passaIdade;
        })
      : [];

  const renderTableContent = () => {
    if (loading) {
      return <AppLoading />;
    }

    if (!data) {
      return (
        <ErrorState
          message="Não foi possível carregar a lista de alunos. Verifique sua conexão."
          onRetry={() => runSearch(searchQuery, searchType)}
        />
      );
    }

    if (filteredAlunos.length === 0) {
      return (
        <EmptyState message="Nenhum aluno encontrado para os filtros selecionados." />
      );
    }

    return (
      <AlunoTable
        alunos={filteredAlunos}
        onEdit={handleEditOpen}
        onDelete={handleDeleteClick}
        onDeactivate={handleDeactivateClick}
      />
    );
  };

  return (
    <>
      <LoadingOverlay open={submitting} />

      <CrudPage
        toolbar={
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <CrudToolbar
              title="Alunos"
              subtitle="Gerenciamento de alunos"
              createLabel="Novo Aluno"
              onCreate={handleCreateOpen}
            />

            <Paper
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 3, mt: -1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FilterAlt sx={{ color: "primary.main" }} fontSize="small" />
                  <Typography
                    variant="overline"
                    sx={{ fontWeight: 800, letterSpacing: 2, lineHeight: 1 }}
                  >
                    Busca e filtros
                  </Typography>
                </Box>

                {hasFilters && (
                  <Button
                    size="small"
                    color="inherit"
                    startIcon={<FilterAltOff />}
                    onClick={clearFilters}
                    sx={{ fontWeight: 700 }}
                  >
                    Limpar filtros
                  </Button>
                )}
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "2fr 1fr 1fr 1fr",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
                    gridColumn: { sm: "1 / -1", lg: "1 / -1" },
                  }}
                >
                  <AppSearch
                    placeholder={`Buscar aluno por ${searchType === "nome" ? "nome" : "e-mail"}...`}
                    onSearch={handleSearch}
                  />
                  <AppSelectField
                    label="Buscar por"
                    value={searchType}
                    options={searchTypeOptions}
                    onChange={(e) =>
                      handleSearchTypeChange(e.target.value as SearchType)
                    }
                  />
                </Box>

                <AppSelectField
                  label="Status"
                  value={statusFilter}
                  options={statusOptions}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilterType)
                  }
                />

                <AppSelectField
                  label="Gênero"
                  value={sexoFilter}
                  options={sexoOptions}
                  onChange={(e) =>
                    setSexoFilter(e.target.value as SexoFilterType)
                  }
                />

                <AppSelectField
                  label="Idade"
                  value={idadeFilter}
                  options={idadeOptions}
                  onChange={(e) =>
                    setIdadeFilter(e.target.value as IdadeFilterType)
                  }
                />
              </Box>
            </Paper>
          </Box>
        }
        table={renderTableContent()}
        pagination={
          !loading && data && !isSearching && filteredAlunos.length > 0 ? (
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
        loading={confirming}
        title={alunoTarget?.usuario?.ativo ? "Desativar Aluno" : "Ativar Aluno"}
        message={`Deseja realmente ${alunoTarget?.usuario?.ativo ? "desativar" : "ativar"} o cadastro do aluno ${alunoTarget?.nome}?`}
        confirmText={alunoTarget?.usuario?.ativo ? "Desativar" : "Ativar"}
        onCancel={() => setDeactivateDialogOpen(false)}
        onConfirm={confirmDeactivate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        severity="error"
        loading={confirming}
        title="Excluir Aluno Permanentemente"
        message={`ATENÇÃO: Deseja realmente excluir permanentemente o aluno ${alunoTarget?.nome}? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir"
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <AppSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={closeNotification}
      />
    </>
  );
}