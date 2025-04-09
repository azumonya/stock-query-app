"use client";
import { StockInfoData } from "@/types/stock";
import { createContext, useContext, useState, ReactNode } from "react";

interface StockContextType {
  stockInfoList: StockInfoData[];
  setStockInfoList: (list: StockInfoData[]) => void;
  stockCode: string;
  setStockCode: (code: string) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
  const [stockCode, setStockCode] = useState("");
  const [stockInfoList, setStockInfoList] = useState<
    StockInfoData[]
  >([]);

  return (
    <StockContext.Provider
      value={{
        stockInfoList,
        setStockInfoList,
        stockCode,
        setStockCode,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStockContext() {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStockContext 必須在 StockProvider 內使用");
  }
  return context;
}
