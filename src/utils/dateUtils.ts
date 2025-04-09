import dayjs from "dayjs";

export enum TimeRange {
  SixMonths = "近 6 个月",
  OneYear = "近 1 年",
  ThreeYears = "近 3 年",
  FiveYears = "近 5 年",
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export const dateUtils = {
  // 根据时间范围获取起始日期
  getStartDate(
    range: TimeRange,
    endDate: string = dayjs().format("YYYY-MM-DD")
  ): string {
    const end = dayjs(endDate);

    switch (range) {
      case TimeRange.SixMonths:
        return end.subtract(6, "month").format("YYYY-MM-DD");
      case TimeRange.OneYear:
        return end.subtract(1, "year").format("YYYY-MM-DD");
      case TimeRange.ThreeYears:
        return end.subtract(3, "year").format("YYYY-MM-DD");
      case TimeRange.FiveYears:
        return end.subtract(5, "year").format("YYYY-MM-DD");
      default:
        return end.format("YYYY-MM-DD");
    }
  },

  // 根据时间范围获取日期范围
  getDateRange(range: TimeRange): DateRange {
    const endDate = dayjs().format("YYYY-MM-DD");
    const startDate = this.getStartDate(range, endDate);
    return {
      startDate,
      endDate,
    };
  },

  // 根据给定日期获取前一年的日期
  getPreviousYearByDate(date: string): string {
    return dayjs(date).subtract(1, "year").format("YYYY-MM-DD");
  },
};
