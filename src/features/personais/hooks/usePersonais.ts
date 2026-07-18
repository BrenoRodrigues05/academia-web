import { useCrud } from "@/api/hooks/useCrud";
import { useState } from "react";
import PersonalService from "../api/PersonalService";
import type { Personal } from "../types/Personal"; 
import { AxiosError } from "axios";
import useNotification from "@/hooks/useNotification"; 

type LastSearchState = {
    type: "nome" | "email" | "cref" | null;
    term: string;
};

export default function usePersonais() {
    const crud = useCrud(PersonalService);
    const { notification, showSuccess, showError, closeNotification } = useNotification();

    const [searchResults, setSearchResults] = useState<Personal[] | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [lastSearch, setLastSearch] = useState<LastSearchState>({
        type: null,
        term: "",
    });

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
            const resultados = await PersonalService.findByNome(termoFormatado);
            setSearchResults(resultados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]); 
                showError("Nenhum personal encontrado com esse nome.");
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
            const resultados = await PersonalService.findByEmail(termoFormatado);
            const listaDeResultados = Array.isArray(resultados) ? resultados : [resultados];
            setSearchResults(listaDeResultados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]); 
                showError("Nenhum personal encontrado com esse email.");
            } else {
                showError("Erro ao realizar a busca por email.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function searchByCref(cref: string) {
        const termoFormatado = cref.trim();

        if (termoFormatado === lastSearch.term && lastSearch.type === "cref") {
            return;
        }

        setLastSearch({
            type: "cref",
            term: termoFormatado
        });

        if (!termoFormatado) {
            setSearchResults(null);
            return;
        }

        setSearchLoading(true);
        try {
            const resultados = await PersonalService.findByCref(termoFormatado);
            const listaDeResultados = Array.isArray(resultados) ? resultados : [resultados];
            setSearchResults(listaDeResultados);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 404) {
                setSearchResults([]); 
                showError("Nenhum personal encontrado com esse CREF.");
            } else {
                showError("Erro ao realizar a busca por CREF.");
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function create(data: unknown) {
        try {
            await PersonalService.create(data);
            showSuccess("Personal cadastrado com sucesso!");
            setSearchResults(null);
            await crud.reload();
        } catch (error) {
            showError("Erro ao cadastrar personal. Tente novamente.");
            throw error; 
        }
    }

    async function update(id: number, data: unknown) {
        try {
            await PersonalService.update(id, data);
            showSuccess("Personal atualizado com sucesso!");
            setSearchResults(null);
            await crud.reload();
        } catch (error) {
            showError("Erro ao atualizar personal.");
            throw error;
        }
    }

    async function desativar(personal: Personal) {
        if (!personal || !personal.id) return;

        try {
            const statusAtual = personal.ativo ?? false;
            const novoStatus = !statusAtual;

            await PersonalService.desativar(personal.id, novoStatus);
            showSuccess(`Personal ${novoStatus ? "ativado" : "desativado"} com sucesso!`);
            await crud.reload();
        } catch (error) {
            showError("Erro ao alterar o status do personal.");
        }
    }

    async function remove(id: number) {
        try {
            await PersonalService.delete(id);
            showSuccess("Personal removido com sucesso!");
            await crud.reload();
        } catch (error) {
            showError("Erro ao remover personal.");
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
        searchByCref,
        create,
        update,
        remove,
        desativar,
        notification,       
        closeNotification,  
    };
}