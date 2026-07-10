import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

export default function AppTable<T>({
    columns,
    rows,
}: Props<T>) {

    return (

        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        {columns.map(column => (

                            <TableCell
                                key={String(column.field)}
                                align={column.align}
                            >

                                {column.header}

                            </TableCell>

                        ))}

                    </TableRow>

                </TableHead>

                <TableBody>

                    {rows.map((row, index) => (

                        <TableRow key={index} hover>

                            {columns.map(column => (

                                <TableCell
                                    key={String(column.field)}
                                    align={column.align}
                                >

                                    {column.render
                                        ? column.render(row)
                                        : String(row[column.field] ?? "")
                                    }

                                </TableCell>

                            ))}

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}