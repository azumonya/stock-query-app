"use client";
import { useStockContext } from "@/context/StockContext";
import { stockService } from "@/services/stockService";
import { StockInfoData, StockMonthRevenueWithGrowthRate } from "@/types/stock";
import { dateUtils, TimeRange } from "@/utils/dateUtils";
import { useEffect, useState } from "react";
import HorizontalTable from "./HorizontalTable";
import StockChart from "./StockChart";

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
    setMonthRevenueData([]);
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
                data.revenue_year === currentData.revenue_year - 1 &&
                data.revenue_month === currentData.revenue_month
            );

            return {
              ...currentData,
              revenue: currentData.revenue / 1000,
              growthRate: lastYearData?.revenue
                ? Number(
                    (
                      (currentData.revenue / lastYearData.revenue - 1) *
                      100
                    ).toFixed(2)
                  )
                : 0,
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
  }, [stockInfoData, timeRange]);

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600 text-lg">
            {`未找到代码为 ${stockCode} 的股票信息`}
          </p>
        </div>
      </div>
    );
  }

  if (!stockInfoData) {
    return <></>;
  }

  const StockInfo = () => {
    if (!stockInfoData) {
      return (
        <div className="h-20 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-lg">暂无数据</p>
        </div>
      );
    }
    return (
      <div className="bg-white p-4 shadow-md border">
        <div className="flex items-center gap-3 text-xl">
          <h1 className="font-bold text-gray-900">
            {stockInfoData.stock_name}
          </h1>
          <span>{`(${stockInfoData.stock_id})`}</span>
        </div>
      </div>
    );
  };

  const StockChartContiner = () => {
    return (
      <div className="bg-white shadow-md border">
        <div className="p-4 pb-0 flex justify-between">
          <div className="inline-block">
            <p className="bg-blue-500 text-white px-4 py-2 rounded-sm text-sm">
              每月营收
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="bg-blue-500 text-white px-4 py-2 text-center rounded-sm text-sm border-none outline-none cursor-pointer hover:bg-blue-600 transition-colors appearance-none"
          >
            {Object.values(TimeRange).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <StockChart monthRevenueData={monthRevenueData} />
        </div>
      </div>
    );
  };

  const StockHistoryList = () => {
    return (
      <>
        <div className="bg-white shadow-md py-6 border">
          <div className="pl-4 pb-4 inline-block">
            <p className="bg-blue-500 text-white px-4 py-2 rounded-sm text-sm">
              详细数据
            </p>
          </div>
          <HorizontalTable data={monthRevenueData} />
        </div>
        <div className="text-right text-gray-600 space-y-2">
          <p>图表单位：千元，数据来自公开咨询观测站</p>
          <p>网页图表欢迎转帖引用，请注明出处为财报狗</p>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 space-y-6">
      <StockInfo />
      <StockChartContiner />
      <StockHistoryList />
    </div>
  );
}
