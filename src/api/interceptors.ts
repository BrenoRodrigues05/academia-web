import api from "./axios";

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    return Promise.reject(error);
  }
);

export default api;