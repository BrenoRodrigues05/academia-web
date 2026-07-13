import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
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

                    {rows.length === 0 && (

                        <TableRow>

                            <TableCell
                                colSpan={columns.length}
                                align="center"
                            >

                                <Typography>

                                    Nenhum registro encontrado.

                                </Typography>

                            </TableCell>

                        </TableRow>

                    )}

                    {rows.map(row => (

                        <TableRow key={rowKey(row)}>

                            {columns.map(column => (

                                <TableCell

                                    key={column.header}

                                    align={column.align}

                                >

                                    {column.render

                                        ? column.render(row)

                                        : String(

                                            row[
                                                column.field as keyof T
                                                ] ?? ""

                                        )}

                                </TableCell>

                            ))}

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </Paper>

    );

}