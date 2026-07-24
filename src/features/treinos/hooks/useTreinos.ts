import { useState } from "react";
import { AxiosError } from "axios";

import { useCrud } from "@/api/hooks/useCrud";
import useNotification from "@/hooks/useNotification";

import TreinoService from "../api/TreinoService";
import type { Treino } from "../types";
import type { TreinoFormData } from "../validation/treinoSchema";

type LastSearchState = {
    type: "nome" | "aluno" | "personal" | "ativos" | "inativos" | null;
    term: string | number;
};

export default function useTreinos() {
    const crud = useCrud(TreinoService);

    const [searchResults, setSearchResults] = useState<Treino[] | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [lastSearch, setLastSearch] = useState<LastSearchState>({
        type: null,
        term: "",
    });

    function clearSearch() {

    setSearchResults(null);

    setLastSearch({

        type: null,

        term: "",

    });

}

    const {
        notification,
        showSuccess,
        showError,
        closeNotification,
    } = useNotification();

    async function searchByNome(nome: string) {
        const termo = nome.trim();

        if (termo === lastSearch.term && lastSearch.type === "nome") {
            return;
        }

        setLastSearch({
            type: "nome",
            term: termo,
        });

        if (!termo) {
            clearSearch();
            return;
        }

        setSearchLoading(true);

        try {
            const dados = await TreinoService.findByNome(termo);
            setSearchResults(dados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]);
                showError("Nenhum treino encontrado.");
            } else {
                showError("Erro ao buscar treino.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function searchByAluno(alunoId: number) {
        if (alunoId === lastSearch.term && lastSearch.type === "aluno") {
            return;
        }

        setLastSearch({
            type: "aluno",
            term: alunoId,
        });

        setSearchLoading(true);

        try {
            const treino = await TreinoService.findByAluno(alunoId);
            setSearchResults(treino ? [treino] : []);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]);
                showError("Nenhum treino encontrado para este aluno.");
            } else {
                showError("Erro ao buscar treino do aluno.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function searchByPersonal(personalId: number) {
        if (personalId === lastSearch.term && lastSearch.type === "personal") {
            return;
        }

        setLastSearch({
            type: "personal",
            term: personalId,
        });

        setSearchLoading(true);

        try {
            const dados = await TreinoService.findByPersonal(personalId);
            setSearchResults(dados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]);
                showError("Nenhum treino encontrado.");
            } else {
                showError("Erro ao buscar treinos.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function searchAtivos() {
        setSearchLoading(true);

        try {
            const dados = await TreinoService.findAtivos();
            setSearchResults(dados);
            setLastSearch({
                type: "ativos",
                term: "",
            });
        } catch {
            showError("Erro ao buscar treinos ativos.");
        } finally {
            setSearchLoading(false);
        }
    }

    async function searchInativos() {
        setSearchLoading(true);

        try {
            const dados = await TreinoService.findInativos();
            setSearchResults(dados);
            setLastSearch({
                type: "inativos",
                term: "",
            });
        } catch {
            showError("Erro ao buscar treinos inativos.");
        } finally {
            setSearchLoading(false);
        }
    }

    async function create(data: TreinoFormData) {
        try {
            await TreinoService.create(data);
            showSuccess("Treino cadastrado com sucesso!");
            clearSearch();
            await crud.reload();
        } catch (error) {
            showError("Erro ao cadastrar treino.");
            throw error;
        }
    }

    async function update(id: number, data: TreinoFormData) {
        try {
            await TreinoService.update(id, data);
            showSuccess("Treino atualizado com sucesso!");
            clearSearch();
            await crud.reload();
        } catch (error) {
            showError("Erro ao atualizar treino.");
            throw error;
        }
    }

    async function alterarStatus(treino: Treino) {
        try {
            await TreinoService.alterarStatus(treino.id, !treino.ativo);
            showSuccess(
                `Treino ${treino.ativo ? "desativado" : "ativado"} com sucesso!`
            );
            clearSearch();
            await crud.reload();
        } catch {
            showError("Erro ao alterar status.");
        }
    }

    async function remove(id: number) {
        try {
            await TreinoService.delete(id);
            showSuccess("Treino removido com sucesso!");
            clearSearch();
            await crud.reload();
        } catch {
            showError("Erro ao remover treino.");
        }
    }

    return {
        ...crud,
        data:
            searchResults !== null
                ? {
                    content: searchResults,
                    totalPages: 1,
                    totalElements: searchResults.length,
                }
                : crud.data,
        loading: crud.loading || searchLoading,
        isSearching: searchResults !== null,
        searchByNome,
        searchByAluno,
        searchByPersonal,
        searchAtivos,
        searchInativos,
        create,
        update,
        remove,
        alterarStatus,
        notification,
        closeNotification,
    };
}