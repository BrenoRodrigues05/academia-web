import { Box, Pagination, Typography } from "@mui/material";

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
      <Typography variant="body2" color="text.secondary">
        Total de registros:{" "}
        <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>
          {totalElements}
        </Box>
      </Typography>

      <Pagination
        page={page + 1}
        count={totalPages}
        color="primary"
        shape="rounded"
        onChange={(_, value) => onChange(value - 1)}
        sx={{
          "& .MuiPaginationItem-root": { fontWeight: 700 },
          "& .Mui-selected": { fontWeight: 900 },
        }}
      />
    </Box>
  );
}