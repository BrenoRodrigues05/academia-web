import { useCrud } from "@/api/hooks/useCrud";
import { useState } from "react";
import AlunoService from "../services/AlunoService";
import type { Aluno } from "../types/Aluno";
import { AxiosError } from "axios";
import useNotification from "@/hooks/useNotification";

type LastSearchState = {
  type: "nome" | "email" | null;
  term: string;
};

export default function useAlunos() {
  const crud = useCrud(AlunoService);
  const [searchResults, setSearchResults] = useState<Aluno[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState<LastSearchState>({
    type: null,
    term: "",
  });

  const { notification, showSuccess, showError, closeNotification } = useNotification();

  async function searchByNome(nome: string) {
  const termoFormatado = nome.trim();

  if (termoFormatado === lastSearch.term && lastSearch.type === "nome") {
    return;
  }

  setLastSearch({
    type: "nome",
    term: termoFormatado
  });

  if (!termoFormatado) {
    setSearchResults(null);
    return;
  }

  setSearchLoading(true);
  try {
    const resultados = await AlunoService.findByNome(termoFormatado);
    setSearchResults(resultados);
  } catch (error) {
    const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        setSearchResults([]); 
        showError("Nenhum aluno encontrado com esse nome.");
      } else {
        showError("Erro ao realizar a busca por nome.");
      }
  } finally {
    setSearchLoading(false);
  }
}

async function searchByEmail(email: string) {
  const termoFormatado = email.trim();

  if (termoFormatado === lastSearch.term && lastSearch.type === "email") {
    return;
  }

  setLastSearch({
    type: "email",
    term: termoFormatado
  });

  if (!termoFormatado) {
    setSearchResults(null);
    return;
  }

  setSearchLoading(true);
  try {
    const resultados = await AlunoService.findByEmail(termoFormatado);
    const listaDeResultados = Array.isArray(resultados) ? resultados : [resultados];
    setSearchResults(listaDeResultados);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
        setSearchResults([]); 
        showError("Nenhum aluno encontrado com esse email.");
      } else {
        showError("Erro ao realizar a busca por email.");
      }
  } finally {
    setSearchLoading(false);
  }
}

  async function create(data: unknown) {
    try {
      await AlunoService.create(data);
      showSuccess(

      "Aluno cadastrado."

      );
      setSearchResults(null);
      await crud.reload();
    } catch (error) {
      showError(

      "Erro ao cadastrar aluno."

      );
      throw error; 
    }
  }

  async function update(id: number, data: unknown) {
    try {
      await AlunoService.update(id, data);
      showSuccess(

      "Aluno atualizado."

      );
      setSearchResults(null);
      await crud.reload();
    } catch (error) {
      showError(

      "Erro ao atualizar aluno."

      );
      throw error;
    }
  }

  async function desativar(aluno: Aluno) {
  if (!aluno || !aluno.id) return;

  try {
    const statusAtual = aluno.usuario?.ativo ?? false;
    const novoStatus = !statusAtual;

    await AlunoService.desativar(aluno.id, novoStatus);

    showSuccess(
      `Aluno ${novoStatus ? "ativado" : "desativado"} com sucesso!`,
      );
    await crud.reload();

  } catch (error) {
    showError(
      "Erro ao alterar o status do aluno."
    );
  }
}

  async function remove(id: number) {
    try {
      await AlunoService.delete(id);
      showSuccess(

      "Aluno removido com sucesso."

      );
      await crud.reload();
    } catch (error) {
      showError(
      "Erro ao remover aluno."
      );
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
    searchByEmail,
    create,
    update,
    remove,
    desativar,
    notification,
    closeNotification,
  };
}