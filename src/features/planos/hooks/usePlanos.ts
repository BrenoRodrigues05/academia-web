import { useCrud } from "@/api/hooks/useCrud";
import { useState } from "react";
import PlanoService from "../api/PlanoService";
import type { Plano } from "../types/Plano";
import { AxiosError } from "axios";
import useNotification from "@/hooks/useNotification";
import type { TipoPlano } from "@/shared/enums/TipoPlano";

type LastSearchState = {
    type: "nome" | "descricao" | "valor" | "tipo" | null;
    term: string | number | TipoPlano;
};

export default function usePlanos() {
    const crud = useCrud(PlanoService);
    const [searchResults, setSearchResults] = useState<Plano[] | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [lastSearch, setLastSearch] = useState<LastSearchState>({
        type: null,
        term: "",
    });

    const { notification, showSuccess, showError, closeNotification } = useNotification();

    const clearSearch = () => {
        setSearchResults(null);
        setLastSearch({ type: null, term: "" });
    };

    async function searchByNome(nome: string) {
        const termoFormatado = nome.trim();

        if (termoFormatado === lastSearch.term && lastSearch.type === "nome") {
            return;
        }

        setLastSearch({ type: "nome", term: termoFormatado });

        if (!termoFormatado) {
            clearSearch();
            return;
        }

        setSearchLoading(true);
        try {
            const resultados = await PlanoService.findByNome(termoFormatado);
            setSearchResults(resultados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]);
                showError("Nenhum plano encontrado com esse nome.");
            } else {
                showError("Erro ao realizar a busca por nome.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function searchByDescricao(descricao: string) {
        const termoFormatado = descricao.trim();

        if (termoFormatado === lastSearch.term && lastSearch.type === "descricao") {
            return;
        }

        setLastSearch({ type: "descricao", term: termoFormatado });

        if (!termoFormatado) {
            clearSearch();
            return;
        }

        setSearchLoading(true);
        try {
            const resultados = await PlanoService.findByDescricao(termoFormatado);
            setSearchResults(resultados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]);
                showError("Nenhum plano encontrado com essa descrição.");
            } else {
                showError("Erro ao realizar a busca por descrição.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function searchByValor(valor: number) {
        if (valor === lastSearch.term && lastSearch.type === "valor") {
            return;
        }

        setLastSearch({ type: "valor", term: valor });

        if (!valor || valor <= 0) {
            clearSearch();
            return;
        }

        setSearchLoading(true);
        try {
            const resultados = await PlanoService.findByValor(valor);
            setSearchResults(resultados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]);
                showError("Nenhum plano encontrado com esse valor.");
            } else {
                showError("Erro ao realizar a busca por valor.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function searchByTipo(tipo: TipoPlano) {
        if (tipo === lastSearch.term && lastSearch.type === "tipo") {
            return;
        }

        setLastSearch({ type: "tipo", term: tipo });

        if (!tipo) {
            clearSearch();
            return;
        }

        setSearchLoading(true);
        try {
            const resultados = await PlanoService.findByTipo(tipo);
            setSearchResults(resultados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]);
                showError("Nenhum plano encontrado para esse tipo.");
            } else {
                showError("Erro ao realizar a busca por tipo.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function create(data: unknown) {
        try {
            await PlanoService.create(data);
            showSuccess("Plano cadastrado com sucesso!");
            clearSearch();
            await crud.reload();
        } catch (error) {
            showError("Erro ao cadastrar plano.");
            throw error;
        }
    }

    async function update(id: number, data: unknown) {
        try {
            await PlanoService.update(id, data);
            showSuccess("Plano atualizado com sucesso.");
            clearSearch();
            await crud.reload();
        } catch (error) {
            showError("Erro ao atualizar plano.");
            throw error;
        }
    }

    async function remove(id: number) {
        try {
            await PlanoService.delete(id);
            showSuccess("Plano removido com sucesso.");
            await crud.reload();
        } catch (error) {
            showError("Erro ao remover plano.");
        }
    }

    return {
        ...crud,
        data:
            searchResults !== null
                ? { content: searchResults, totalPages: 1, totalElements: searchResults.length }
                : crud.data,
        loading: crud.loading || searchLoading,
        isSearching: searchResults !== null,
        searchByNome,
        searchByDescricao,
        searchByValor,
        searchByTipo,
        clearSearch,
        create,
        update,
        remove,
        notification,
        closeNotification,
    };
}