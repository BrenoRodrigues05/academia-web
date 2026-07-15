import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Box,
    Card,
    CardContent,
    Divider,
    useTheme,
    useMediaQuery
} from "@mui/material";

import type { CrudColumn } from "./types";

type Props<T> = {
    rows: T[];
    columns: CrudColumn<T>[];
    rowKey: (row: T) => number | string;
};

export default function CrudTable<T>({
    rows,
    columns,
    rowKey,
}: Props<T>) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (rows.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                    Nenhum registro encontrado.
                </Typography>
            </Paper>
        );
    }

    if (isMobile) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {rows.map((row) => (
                    <Card key={rowKey(row)} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            {columns.map((column, idx) => {
                                const val = column.render
                                    ? column.render(row)
                                    : String(row[column.field as keyof T] ?? "");
                                if (idx === 0) {
                                    return (
                                        <Box key={column.header} sx={{ mb: 1.5 }}>
                                            <Typography 
                                                variant="subtitle1" 
                                                color="primary.main"
                                                sx={{ fontWeight: "bold" }} 
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
                                            py: 0.5,
                                            fontSize: "0.875rem"
                                        }}
                                    >
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary" 
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {column.header}:
                                        </Typography>
                                        <Box sx={{ textAlign: "right" }}>
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
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell
                                key={column.header}
                                align={column.align}
                                width={column.width}
                            >
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={rowKey(row)}>
                            {columns.map(column => (
                                <TableCell
                                    key={column.header}
                                    align={column.align}
                                >
                                    {column.render
                                        ? column.render(row)
                                        : String(row[column.field as keyof T] ?? "")}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}