import { useEffect, useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Search,
  Close,
} from "@mui/icons-material";

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(search);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [search, debounce, onSearch]);

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
              <Search />
            </InputAdornment>
          ),
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearch("")}
              >
                <Close />
              </IconButton>
            </InputAdornment>
          ) : null, 
        },
      }}
    />
  );
}