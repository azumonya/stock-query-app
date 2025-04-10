"use client";
import { useStockContext } from "@/context/StockContext";
import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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

    const handleIconClick = () => {
      if (inputValue.trim()) {
        setStockCode(inputValue);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="text-center">
        <TextField
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入台股代号，查看公司价值"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    disableRipple={true}
                    onClick={handleIconClick}
                    sx={{
                      padding: "4px",
                      margin: "0 5px",
                      "& .MuiSvgIcon-root": {
                        width: "20px",
                        height: "20px",
                      },
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          sx={{
            maxWidth: "400px",
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              backgroundColor: "#fafafa",
              height: "37px",
              padding: 0,
            },
            "& .MuiInputBase-input": {
              padding: "14px",
            },
          }}
        />
      </form>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="container mx-auto px-4 py-4">
        <SearchBar />
      </div>
    </nav>
  );
}
