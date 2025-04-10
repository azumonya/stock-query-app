import React, { useEffect, useRef } from "react";
import { StockMonthRevenueWithGrowthRate } from "@/types/stock";
import { stockUtils } from "@/utils/stockUtils";

interface HorizontalTableProps {
  data: StockMonthRevenueWithGrowthRate[];
}

export default function HorizontalTable({ data }: HorizontalTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [data]);

  const headerItems = [
    { label: "年度月份", key: "date" },
    { label: "每月营收", key: "revenue" },
    { label: "营收年增率 (%)", key: "growthRate" },
  ];

  const cellClassName = "p-3 h-14 flex items-center border-b last:border-b-0";
  const headerCellClassName = `${cellClassName} font-medium whitespace-nowrap px-4`;
  const contentCellClassName = `${cellClassName} justify-end pr-4`;
  const columnClassName =
    "w-28 flex-none border-r last:border-r-0 [&>*:nth-child(odd)]:bg-gray-50";

  return (
    <div className="w-full overflow-hidden border [&_*]:border-gray-200">
      <div className="flex">
        <div className="flex-none border-r [&>*:nth-child(odd)]:bg-gray-50">
          {headerItems.map((item) => (
            <div key={item.key} className={headerCellClassName}>
              {item.label}
            </div>
          ))}
        </div>

        <div ref={scrollContainerRef} className="flex-grow overflow-x-auto">
          <div className="flex min-w-max">
            {data.map((item) => (
              <div key={item.date} className={columnClassName}>
                <div className={contentCellClassName}>
                  {`${item.revenue_year}${item.revenue_month
                    .toString()
                    .padStart(2, "0")}`}
                </div>
                <div className={contentCellClassName}>
                  <span className="text-sm">
                    {stockUtils.formatRevenue(item.revenue)}
                  </span>
                </div>
                <div className={contentCellClassName}>
                  <span>{item.growthRate ? item.growthRate : "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
