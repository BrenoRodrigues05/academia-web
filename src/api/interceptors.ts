import type { AxiosInstance } from "axios";

export function setupInterceptors(api: AxiosInstance) {
  api.interceptors.request.use((config) => {
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
}