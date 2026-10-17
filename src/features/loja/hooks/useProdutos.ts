import { useState, useEffect, useCallback } from "react";
import type { PageResponse } from "../api/ProdutoService";
import ProdutoService from "../api/ProdutoService";
import type { Produto } from "../types";

export default function useProdutos() {
    const [data, setData] = useState<PageResponse<Produto> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(10);
    
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "info" | "warning",
    });

    const loadProdutos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ProdutoService.listarPaginado(page, size);
            setData(response);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            showNotification("Erro ao carregar produtos.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        loadProdutos();
    }, [loadProdutos]);

    const showNotification = (message: string, severity: "success" | "error" | "info" | "warning") => {
        setNotification({ open: true, message, severity });
    };

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    const create = async (dto: any) => {
        try {
            await ProdutoService.create(dto);
            showNotification("Produto criado com sucesso!", "success");
            loadProdutos();
        } catch (error) {
            showNotification("Erro ao criar produto.", "error");
            throw error;
        }
    };

    const update = async (id: number, dto: any) => {
        try {
            await ProdutoService.update(id, dto);
            showNotification("Produto atualizado com sucesso!", "success");
            loadProdutos();
        } catch (error) {
            showNotification("Erro ao atualizar produto.", "error");
            throw error;
        }
    };

    const remove = async (id: number) => {
        try {
            await ProdutoService.delete(id);
            showNotification("Produto excluído com sucesso!", "success");
            loadProdutos();
        } catch (error) {
            showNotification("Erro ao excluir produto.", "error");
            throw error;
        }
    };

    return {
        data,
        loading,
        page,
        setPage,
        reload: loadProdutos,
        create,
        update,
        remove,
        notification,
        closeNotification,
    };
}