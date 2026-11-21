import { useEffect, useRef, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Close, Search } from "@mui/icons-material";

type Props = {
  value?: string;
  placeholder?: string;
  debounce?: number;
  onSearch: (value: string) => void;
};

export default function AppSearch({
  value = "",
  placeholder = "Pesquisar...",
  debounce = 500,
  onSearch,
}: Props) {
  const [search, setSearch] = useState(value);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchRef.current(search);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [search, debounce]);

  return (
    <TextField
      fullWidth
      value={search}
      placeholder={placeholder}
      onChange={(e) => setSearch(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearch("")}
                aria-label="Limpar busca"
              >
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}