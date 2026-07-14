import { useCrud } from "@/api/hooks/useCrud";
import { useState } from "react";
import AlunoService from "../services/AlunoService";
import type { Aluno } from "../types/Aluno";

export type NotificationState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

export default function useAlunos() {
  const crud = useCrud(AlunoService);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "success",
  });

  const [searchResults, setSearchResults] = useState<Aluno[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState<string>("");

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  async function searchByNome(nome: string) {
  const termoFormatado = nome.trim();

  if (termoFormatado === lastSearch) {
    return;
  }

  setLastSearch(termoFormatado);

  if (!termoFormatado) {
    setSearchResults(null);
    return;
  }

  setSearchLoading(true);
  try {
    const resultados = await AlunoService.findByNome(termoFormatado);
    setSearchResults(resultados);
  } catch (error: any) {
    if (error.response?.status === 404) {
      setSearchResults([]); 
      setNotification({
        open: true,
        message: "Nenhum aluno encontrado com esse nome.",
        severity: "error",
      });
    } else {
      setNotification({
        open: true,
        message: "Erro ao realizar a busca por nome.",
        severity: "error",
      });
    }
  } finally {
    setSearchLoading(false);
  }
}

  async function create(data: unknown) {
    try {
      await AlunoService.create(data);
      setNotification({
        open: true,
        message: "Aluno cadastrado com sucesso!",
        severity: "success",
      });
      setSearchResults(null);
      await crud.reload();
    } catch (error) {
      setNotification({
        open: true,
        message: "Erro ao cadastrar aluno. Tente novamente.",
        severity: "error",
      });
      throw error; 
    }
  }

  async function update(id: number, data: unknown) {
    try {
      await AlunoService.update(id, data);
      setNotification({
        open: true,
        message: "Aluno atualizado com sucesso!",
        severity: "success",
      });
      setSearchResults(null);
      await crud.reload();
    } catch (error) {
      setNotification({
        open: true,
        message: "Erro ao atualizar aluno.",
        severity: "error",
      });
      throw error;
    }
  }

  async function desativar(aluno: Aluno) {
  if (!aluno || !aluno.id) return;

  try {
    const statusAtual = aluno.usuario?.ativo ?? false;
    const novoStatus = !statusAtual;

    await AlunoService.desativar(aluno.id, novoStatus);

    setNotification({
      open: true,
      message: `Aluno ${novoStatus ? "ativado" : "desativado"} com sucesso!`,
      severity: "success",
    });
    await crud.reload();

  } catch (error) {
    setNotification({
      open: true,
      message: "Erro ao alterar o status do aluno.",
      severity: "error",
    });
  }
}

  async function remove(id: number) {
    try {
      await AlunoService.delete(id);
      setNotification({
        open: true,
        message: "Aluno removido com sucesso!",
        severity: "success",
      });
      await crud.reload();
    } catch (error) {
      setNotification({
        open: true,
        message: "Erro ao remover aluno.",
        severity: "error",
      });
    }
  }

  return {
    ...crud,
    data: searchResults !== null 
      ? { content: searchResults, totalPages: 1, totalElements: searchResults.length } 
      : crud.data,
    loading: crud.loading || searchLoading,
    isSearching: searchResults !== null,
    searchByNome,
    create,
    update,
    remove,
    desativar,
    notification,
    closeNotification,
  };
}