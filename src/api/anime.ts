import { Data } from "../types/data";
import apiClient from "./apiClient";

export const searchAnime = async (
  query: string,
  page?: number
): Promise<Data> => {
  const response = await apiClient.get<Data>("/search", {
    params: { query, page },
  });
  return response.data;
};
