'use client';
import StockDetail from "@/components/StockDetail";
import { useStockContext } from "@/context/StockContext";
import { stockService } from "@/services/stockService";
import { useEffect } from "react";

export default function Home() {
  const { setStockInfoList } = useStockContext();

  useEffect(() => {
    const fetchStockList = async () => {
      try {
        const data = await stockService.getTaiwanStockInfoList({});
        setStockInfoList(data);
      } catch (error) {
        console.error("获取股票列表失败:", error);
      }
    };

    fetchStockList();
  }, [setStockInfoList]);

  return (
    <div>
      <StockDetail />
    </div>
  );
}
