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
        count?: () => Promise<number>;
    },
    fetchCount: boolean = false
) {

    const [data, setData] =
        useState<PageResponse<T>>();

    const [count, setCount] =
        useState<number>(0);

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

            if (fetchCount && service.count) {
                const total = await service.count();
                setCount(total);
            }

        } finally {

            setLoading(false);

        }

    }, [page, service, fetchCount]);

    useEffect(() => {

        load();

    }, [load]);

    return {

        data,

        count,

        page,

        setPage,

        loading,

        reload: load,

    };

}