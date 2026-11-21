import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    alpha,
    } from "@mui/material";

    type Column<T> = {
    field: keyof T;
    header: string;
    align?: "left" | "center" | "right";
    render?: (row: T) => React.ReactNode;
    };

    type Props<T> = {
    columns: Column<T>[];
    rows: T[];
    };

    export default function AppTable<T>({ columns, rows }: Props<T>) {
    return (
        <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 3, overflow: "hidden" }}
        >
        <Table>
            <TableHead>
            <TableRow sx={{ bgcolor: (t) => alpha(t.palette.text.primary, 0.04) }}>
                {columns.map((column) => (
                <TableCell
                    key={String(column.field)}
                    align={column.align}
                    sx={{
                    fontWeight: 800,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "text.secondary",
                    borderBottomColor: "divider",
                    }}
                >
                    {column.header}
                </TableCell>
                ))}
            </TableRow>
            </TableHead>

            <TableBody>
            {rows.map((row, index) => (
                <TableRow
                key={index}
                hover
                sx={{
                    "&:hover": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                    },
                    "&:last-child td": { borderBottom: 0 },
                }}
                >
                {columns.map((column) => (
                    <TableCell
                    key={String(column.field)}
                    align={column.align}
                    sx={{ borderBottomColor: "divider" }}
                    >
                    {column.render
                        ? column.render(row)
                        : String(row[column.field] ?? "")}
                    </TableCell>
                ))}
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}