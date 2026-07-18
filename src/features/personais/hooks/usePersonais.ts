import { useCrud } from "@/api/hooks/useCrud";
import { useState } from "react";
import PersonalService from "../api/PersonalService";
import type { Personal } from "../types/Personal"; 
import { AxiosError } from "axios";

export type NotificationState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

type LastSearchState = {
    type: "nome" | "email" | "cref" | null;
    term: string;
};

export default function usePersonais() {
    const crud = useCrud(PersonalService);
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: "",
        severity: "success",
    });

    const [searchResults, setSearchResults] = useState<Personal[] | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [lastSearch, setLastSearch] = useState<LastSearchState>({
        type: null,
        term: "",
    });

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

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
                setNotification({
                    open: true,
                    message: "Nenhum personal encontrado com esse nome.",
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
                setNotification({
                    open: true,
                    message: "Nenhum personal encontrado com esse email.",
                    severity: "error",
                });
            } else {
                setNotification({
                    open: true,
                    message: "Erro ao realizar a busca por email.",
                    severity: "error",
                });
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
                setNotification({
                    open: true,
                    message: "Nenhum personal encontrado com esse CREF.",
                    severity: "error",
                });
            } else {
                setNotification({
                    open: true,
                    message: "Erro ao realizar a busca por CREF.",
                    severity: "error",
                });
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function create(data: unknown) {
        try {
            await PersonalService.create(data);
            setNotification({
                open: true,
                message: "Personal cadastrado com sucesso!",
                severity: "success",
            });
            setSearchResults(null);
            await crud.reload();
        } catch (error) {
            setNotification({
                open: true,
                message: "Erro ao cadastrar personal. Tente novamente.",
                severity: "error",
            });
            throw error; 
        }
    }

    async function update(id: number, data: unknown) {
        try {
            await PersonalService.update(id, data);
            setNotification({
                open: true,
                message: "Personal atualizado com sucesso!",
                severity: "success",
            });
            setSearchResults(null);
            await crud.reload();
        } catch (error) {
            setNotification({
                open: true,
                message: "Erro ao atualizar personal.",
                severity: "error",
            });
            throw error;
        }
    }

    async function desativar(personal: Personal) {
        if (!personal || !personal.id) return;

        try {
            const statusAtual = personal.ativo ?? false;
            const novoStatus = !statusAtual;

            await PersonalService.desativar(personal.id, novoStatus);

            setNotification({
                open: true,
                message: `Personal ${novoStatus ? "ativado" : "desativado"} com sucesso!`,
                severity: "success",
            });
            await crud.reload();

        } catch (error) {
            setNotification({
                open: true,
                message: "Erro ao alterar o status do personal.",
                severity: "error",
            });
        }
    }

    async function remove(id: number) {
        try {
            await PersonalService.delete(id);
            setNotification({
                open: true,
                message: "Personal removido com sucesso!",
                severity: "success",
            });
            await crud.reload();
        } catch (error) {
            setNotification({
                open: true,
                message: "Erro ao remover personal.",
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