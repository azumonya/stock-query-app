"use client";
import { useStockContext } from "@/context/StockContext";
import { stockService } from "@/services/stockService";
import { StockInfoData, StockMonthRevenueWithGrowthRate } from "@/types/stock";
import { dateUtils, TimeRange } from "@/utils/dateUtils";
import { useEffect, useState } from "react";

export default function StockDetail() {
  const { stockCode, stockInfoList } = useStockContext();
  const [notFound, setNotFound] = useState(false);
  const [stockInfoData, setStockInfoData] = useState<
    StockInfoData | undefined
  >();
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.FiveYears);
  const [monthRevenueData, setMonthRevenueData] = useState<
    StockMonthRevenueWithGrowthRate[]
  >([]);

  useEffect(() => {
    const fetchStockData = () => {
      if (stockCode) {
        const foundStock = stockInfoList.find(
          (stock) => stock.stock_id === stockCode
        );
        if (foundStock) {
          setStockInfoData(foundStock);
        } else {
          setNotFound(true);
        }
      }
    };
    setNotFound(false);
    setStockInfoData(undefined);
    setTimeRange(TimeRange.FiveYears);
    fetchStockData();
  }, [stockCode, stockInfoList]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMonthRevenueData = async () => {
      if (stockInfoData) {
        try {
          const { startDate, endDate } = dateUtils.getDateRange(timeRange);
          const [monthRevenueData, previousYearMonthRevenueData] =
            await Promise.all([
              stockService.getTaiwanStockMonthRevenueData(
                {
                  data_id: stockInfoData.stock_id,
                  start_date: startDate,
                  end_date: endDate,
                },
                abortController.signal
              ),
              stockService.getTaiwanStockMonthRevenueData(
                {
                  data_id: stockInfoData.stock_id,
                  start_date: dateUtils.getPreviousYearByDate(startDate),
                  end_date: startDate,
                },
                abortController.signal
              ),
            ]);

          const allMonthRevenueData = [
            ...monthRevenueData,
            ...previousYearMonthRevenueData,
          ];
          const growthRates = monthRevenueData.map((currentData) => {
            const lastYearData = allMonthRevenueData.find(
              (data) =>
                data.date === dateUtils.getPreviousYearByDate(currentData.date)
            );

            return {
              ...currentData,
              growthRate:
                lastYearData &&
                Number(
                  (
                    ((currentData.revenue - lastYearData.revenue) /
                      lastYearData.revenue) *
                    100
                  ).toFixed(2)
                ),
            };
          });

          setMonthRevenueData(growthRates);
        } catch (error) {
          if ((error as Error).name === "AbortError") {
            return;
          }
          console.error("获取月营收数据失败:", error);
        }
      }
    };
    fetchMonthRevenueData();
    return () => {
      abortController.abort();
    };
  }, [stockInfoData]);

  if (notFound) {
    return <div>{`未找到代码为 ${stockCode} 的股票信息`}</div>;
  }

  const StockInfo = () => {
    return (
      <div>
        <p>{`${stockInfoData?.stock_name}(${stockInfoData?.stock_id})`}</p>
      </div>
    );
  };

  const StockChart = () => {
    return <div>StockChart</div>;
  };

  const StockHistoryList = () => {
    return <div>StockHistoryList</div>;
  };

  return (
    <div>
      <StockInfo />
      <StockChart />
      <StockHistoryList />
    </div>
  );
}
