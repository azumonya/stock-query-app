"use client";
import { StockMonthRevenueWithGrowthRate } from "@/types/stock";
import { stockUtils } from "@/utils/stockUtils";
import {
  ResponsiveChartContainer,
  BarPlot,
  LinePlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
  ChartsAxisHighlight,
  LineHighlightPlot,
  ChartsGrid,
  ChartsLegend,
} from "@mui/x-charts";
import dayjs from "dayjs";

export default function StockChart({
  monthRevenueData,
}: {
  monthRevenueData: StockMonthRevenueWithGrowthRate[];
}) {
  const maxRevenue = Math.max(...monthRevenueData.map((data) => data.revenue));
  const maxGrowthRate = Math.max(
    ...monthRevenueData.map((data) => Math.abs(data.growthRate))
  );

  return (
    <div className="w-full h-[400px]">
      <ResponsiveChartContainer
        dataset={monthRevenueData}
        margin={{ left: 90 }}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "revenueDate",
            id: "revenueDate",
            tickLabelInterval: (value) => {
              const date = dayjs(value, "YYYY-MM");
              const month = date.format("MM");
              return month === "01";
            },
            valueFormatter: (value, context) => {
              if (context.location === "tooltip") {
                return value;
              }
              const date = dayjs(value, "YYYY-MM");
              const year = date.format("YYYY");
              return year;
            },
          },
        ]}
        yAxis={[
          {
            id: "revenue",
            dataKey: "revenue",
            valueFormatter: (value) => {
              if (value > maxRevenue) {
                return "千元";
              } else {
                return stockUtils.formatRevenue(value);
              }
            },
          },
          {
            id: "growthRate",
            dataKey: "growthRate",
            valueFormatter: (value) => {
              if (value > maxGrowthRate) {
                return "%";
              } else {
                return `${value}%`;
              }
            },
          },
        ]}
        series={[
          {
            type: "bar",
            dataKey: "revenue",
            label: "当月营收",
            color: "#ffc107",
          },
          {
            type: "line",
            dataKey: "growthRate",
            label: "当月营收年增率(%)",
            color: "#dc3545",
            yAxisKey: "growthRate",
            curve: "linear",
          },
        ]}
      >
        <BarPlot />
        <LinePlot />
        <LineHighlightPlot />
        {monthRevenueData.length > 0 && (
          <>
            <ChartsTooltip />
            <ChartsAxisHighlight x="line" />
            <ChartsGrid horizontal={true} />

            <ChartsLegend
              position={{ vertical: "top", horizontal: "left" }}
              itemMarkHeight={10}
              itemMarkWidth={10}
              padding={{ top: 60, left: 100 }}
              labelStyle={{
                fontSize: 12,
              }}
            />
          </>
        )}
        <ChartsXAxis
          position="bottom"
          axisId="revenueDate"
          disableTicks={true}
        />
        <ChartsYAxis position="left" axisId="revenue" disableTicks={true} />
        <ChartsYAxis position="right" axisId="growthRate" disableTicks={true} />
      </ResponsiveChartContainer>
    </div>
  );
}
