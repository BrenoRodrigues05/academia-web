import {

useCallback,

useEffect,

useState,

} from "react";

import type { PageResponse } from "../types/PageResponse";

export function useCrud<T>(
    service: {
        findAll: (
            page: number,
            size: number
        ) => Promise<PageResponse<T>>;
    }
) {

    const [data, setData] =
        useState<PageResponse<T>>();

    const [page, setPage] =
        useState(0);

    const [loading, setLoading] =
        useState(false);

    const load = useCallback(async () => {

        setLoading(true);

        try {

            const response =
                await service.findAll(page, 10);

            setData(response);

        } finally {

            setLoading(false);

        }

    }, [page, service]);

    useEffect(() => {

        load();

    }, [load]);

    return {

        data,

        page,

        setPage,

        loading,

        reload: load,

    };

}