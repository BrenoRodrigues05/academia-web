import { useCrud } from "@/api/hooks/useCrud";
import { useState } from "react";
import { AxiosError } from "axios";

import useNotification from "@/hooks/useNotification";

import ExercicioService from "../api/ExercicioService";
import type { Exercicio } from "../types";

type LastSearchState = {
    type: "nome" | "grupoMuscular" | null;
    term: string;
};

interface ApiErrorResponse {
    message?: string;
    error?: string;
    status?: number;
}

export default function useExercicios() {

    const crud = useCrud(ExercicioService);

    const [searchResults, setSearchResults] =
        useState<Exercicio[] | null>(null);

    const [searchLoading, setSearchLoading] =
        useState(false);

    const [lastSearch, setLastSearch] =
        useState<LastSearchState>({
            type: null,
            term: ""
        });

    const {
        notification,
        showSuccess,
        showError,
        closeNotification
    } = useNotification();

    async function searchByNome(nome: string) {

        const termo = nome.trim();

        if (
            termo === lastSearch.term &&
            lastSearch.type === "nome"
        ) {
            return;
        }

        setLastSearch({
            type: "nome",
            term: termo
        });

        if (!termo) {
            setSearchResults(null);
            return;
        }

        setSearchLoading(true);

        try {

            const resultados =
                await ExercicioService.findByNome(termo);

            setSearchResults(resultados);

        } catch (error) {

            const axiosError = error as AxiosError;

            if (axiosError.response?.status === 404) {

                setSearchResults([]);

                showError(
                    "Nenhum exercício encontrado com esse nome."
                );

            } else {

                showError(
                    "Erro ao buscar exercício."
                );

            }

        } finally {

            setSearchLoading(false);

        }

    }

    async function create(data: unknown) {

        try {

            await ExercicioService.create(data);

            showSuccess(
                "Exercício cadastrado com sucesso!"
            );

            setSearchResults(null);

            await crud.reload();

        } catch (error) {
                    const axiosError = error as AxiosError<ApiErrorResponse>;
                            const errorMessage = axiosError.response?.data?.message || "";
                        
                            if (
                                errorMessage.includes("Já existe") 
                            ) {
                                showError("Já existe um exercício cadastrado com este nome.");
                            } else {
                                showError("Erro ao cadastrar Exercício. Verifique os dados informados.");
                            }
                        
                            throw error; 
                        }
        }

    async function update(
        id: number,
        data: unknown
    ) {

        try {

            await ExercicioService.update(id, data);

            showSuccess(
                "Exercício atualizado com sucesso!"
            );

            setSearchResults(null);

            await crud.reload();

        } catch (error) {

            showError(
                "Erro ao atualizar exercício."
            );

            throw error;

        }

    }

    async function remove(id: number) {

        try {

            await ExercicioService.delete(id);

            showSuccess(
                "Exercício removido com sucesso!"
            );

            await crud.reload();

        } catch {

            showError(
                "Erro ao remover exercício."
            );

        }

    }

    return {

        ...crud,

        data:
            searchResults !== null
                ? {
                    content: searchResults,
                    totalPages: 1,
                    totalElements: searchResults.length
                }
                : crud.data,

        loading:
            crud.loading || searchLoading,

        isSearching:
            searchResults !== null,

        searchByNome,

        create,

        update,

        remove,

        notification,

        closeNotification

    };

}