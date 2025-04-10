export const stockUtils = {
  // 格式化货币
  formatRevenue: (money: number) => {
    return money.toLocaleString("zh-TW", {
      currency: "TWD",
    });
  },
};
