import {
    Box,
    Card,
    CardContent,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    alpha,
    useMediaQuery,
    useTheme,
    } from "@mui/material";
    import { InboxOutlined } from "@mui/icons-material";

    import type { CrudColumn } from "./types";

    type Props<T> = {
    rows: T[];
    columns: CrudColumn<T>[];
    rowKey: (row: T) => number | string;
    };

    export default function CrudTable<T>({ rows, columns, rowKey }: Props<T>) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const getValue = (row: T, column: CrudColumn<T>) =>
        column.render
        ? column.render(row)
        : String(row[column.field as keyof T] ?? "");

    if (rows.length === 0) {
        return (
        <Paper
            variant="outlined"
            sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            borderStyle: "dashed",
            backgroundImage: "none",
            }}
        >
            <InboxOutlined
            sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5, mb: 1 }}
            />
            <Typography sx={{ fontWeight: 700 }}>
            Nenhum registro encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Quando houver dados, eles aparecerão aqui.
            </Typography>
        </Paper>
        );
    }

    if (isMobile) {
        return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rows.map((row) => (
            <Card
                key={rowKey(row)}
                variant="outlined"
                sx={{
                borderRadius: 3,
                borderLeft: "4px solid",
                borderLeftColor: "primary.main",
                backgroundImage: "none",
                }}
            >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                {columns.map((column, idx) => {
                    const val = getValue(row, column);

                    if (idx === 0) {
                    return (
                        <Box key={column.header} sx={{ mb: 1.5 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}
                        >
                            {val}
                        </Typography>
                        <Divider />
                        </Box>
                    );
                    }

                    return (
                    <Box
                        key={column.header}
                        sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        py: 0.75,
                        }}
                    >
                        <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                        }}
                        >
                        {column.header}
                        </Typography>
                        <Box sx={{ textAlign: "right", fontSize: "0.875rem" }}>
                        {val}
                        </Box>
                    </Box>
                    );
                })}
                </CardContent>
            </Card>
            ))}
        </Box>
        );
    }

    return (
        <Paper
        variant="outlined"
        sx={{ borderRadius: 3, overflow: "hidden", backgroundImage: "none" }}
        >
        <TableContainer>
            <Table>
            <TableHead>
                <TableRow
                sx={{
                    bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
                }}
                >
                {columns.map((column) => (
                    <TableCell
                    key={column.header}
                    align={column.align}
                    width={column.width}
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
                {rows.map((row) => (
                <TableRow
                    key={rowKey(row)}
                    hover
                    sx={{
                    transition: "background-color .15s",
                    "&:hover": {
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                    },
                    "&:last-child td": { borderBottom: 0 },
                    }}
                >
                    {columns.map((column) => (
                    <TableCell
                        key={column.header}
                        align={column.align}
                        sx={{ borderBottomColor: "divider" }}
                    >
                        {getValue(row, column)}
                    </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </Paper>
    );
}