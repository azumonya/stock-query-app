import { Dataset, FinMindParams } from "@/types/stock";

const BASE_URL = "https://api.finmindtrade.com/api/v4/data";

export const api = {
  async get<T, D extends Dataset>(
    params: FinMindParams<D>,
    signal?: AbortSignal
  ): Promise<T> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
      signal,
    });

    if (!response.ok) {
      throw new Error(`API 请求错误： ${response.statusText}`);
    }

    const result = await response.json();

    if (result.status !== 200) {
      throw new Error(result.msg || "API 请求失败");
    }

    return result.data;
  },
};
