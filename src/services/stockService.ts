import {
  Dataset,
  TaiwanStockParams,
  StockInfoData,
  StockMonthRevenueData,
} from "@/types/stock";
import { api } from "./api";

export const stockService = {
  async getTaiwanStockInfoList(
    params: TaiwanStockParams
  ): Promise<StockInfoData[]> {
    const response = await api.get<StockInfoData[], Dataset.TaiwanStockInfo>({
      ...params,
      dataset: Dataset.TaiwanStockInfo,
    });
    return response;
  },
  async getTaiwanStockMonthRevenueData(
    params: TaiwanStockParams,
    signal?: AbortSignal
  ): Promise<StockMonthRevenueData[]> {
    const response = await api.get<
      StockMonthRevenueData[],
      Dataset.TaiwanStockMonthRevenue
    >(
      {
        ...params,
        dataset: Dataset.TaiwanStockMonthRevenue,
      },
      signal
    );
    return response;
  },
};
