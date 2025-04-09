"use client";
import { useStockContext } from "@/context/StockContext";
import { useState } from "react";

export default function NavBar() {
  const SearchBar = () => {
    const [inputValue, setInputValue] = useState("");
    const { setStockCode } = useStockContext();

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        setStockCode(inputValue);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入台股代号，查看公司价值"
        />
        <button type="submit">搜索</button>
      </form>
    );
  };

  return (
    <nav>
      <SearchBar />
    </nav>
  );
}
