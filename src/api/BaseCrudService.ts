import api from "@/api/axios";
import type { PageResponse } from "./types/PageResponse";

export default class BaseCrudService<T> {
  private readonly endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async findAll(page = 0, size = 10) {
    const response = await api.get<PageResponse<T>>(
      this.endpoint,
      {
        params: {
          page,
          size,
        },
      }
    );
    return response.data;
  }

  async findById(id: number) {
    const response = await api.get<T>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  async create(data: unknown) {
    const response = await api.post<T>(
      this.endpoint,
      data
    );
    return response.data;
  }

  async update(id: number, data: unknown) {
    const response = await api.put<T>(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data;
  }

  async delete(id: number) {
    await api.delete(
      `${this.endpoint}/${id}`
    );
  }
}