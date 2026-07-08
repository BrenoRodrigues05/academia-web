import type { AxiosInstance } from "axios";

import tokenStorage from "@/features/auth/storage/tokenStorage";

export function setupInterceptors(api: AxiosInstance) {

    api.interceptors.request.use((config) => {

        const token = tokenStorage.get();

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    });

    api.interceptors.response.use(

        response => response,

        error => {

            if (error.response?.status === 401) {

            tokenStorage.remove();

            window.location.href = "/";

        }

        return Promise.reject(error);

        }

    );

}