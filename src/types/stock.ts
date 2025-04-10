export interface FinMindParams<T extends Dataset> {
  dataset: T; // 资料集名称
  data_id?: string; // 资料代码
  start_date?: string; // 起始时间
  end_date?: string; // 结束时间
  // token?: string; // 金鑰
}

export enum Dataset {
  TaiwanStockInfo = "TaiwanStockInfo", // 台股总览
  TaiwanStockMonthRevenue = "TaiwanStockMonthRevenue", // 月营收表
}

export type TaiwanStockParams = Omit<
  FinMindParams<Dataset.TaiwanStockMonthRevenue>,
  "dataset" // 资料集名称
>;

export interface StockInfoData {
  industry_category: string; // 产业类别
  stock_id: string; // 股票代码
  stock_name: string; // 股票名称
  type: string; // 股票类型
  date: string; // 更新数据日期
}

export interface StockMonthRevenueData {
  date: string; // 更新数据日期
  stock_id: string; // 股票代码
  country: string; // 所在国家/地区
  revenue: number; // 月营收
  revenue_month: number; // 月营收月份
  revenue_year: number; // 月营收年份
  [key: string]: string | number | undefined;
}

export interface StockMonthRevenueWithGrowthRate
  extends StockMonthRevenueData {
  growthRate: number; // 月营收增长率
}
