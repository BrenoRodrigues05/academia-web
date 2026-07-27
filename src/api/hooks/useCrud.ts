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
        count: () => Promise<number>;
    }
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

            const total =
            await service.count();

            setData(response);
            setCount(total);

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

        count,

        page,

        setPage,

        loading,

        reload: load,

    };

}