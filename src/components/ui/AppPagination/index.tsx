import {
  Box,
  Pagination,
  Typography,
} from "@mui/material";

type Props = {
  page: number;
  totalPages: number;
  totalElements: number;
  onChange: (page: number) => void;
};

export default function AppPagination({
  page,
  totalPages,
  totalElements,
  onChange,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography
        color="text.secondary"
      >
        Total de registros: {totalElements}
      </Typography>

      <Pagination
        page={page + 1}
        count={totalPages}
        color="primary"
        onChange={(_, value) => onChange(value - 1)}
      />
    </Box>
  );
}