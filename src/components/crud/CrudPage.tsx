import type { ReactNode } from "react";
import { Box } from "@mui/material";
import MainLayout from "@/layouts/MainLayout";

type Props = {
    toolbar: ReactNode;
    table: ReactNode;
    pagination?: ReactNode;
    dialogs?: ReactNode;
};

export default function CrudPage({
    toolbar,
    table,
    pagination,
    dialogs,
}: Props) {
    return (
        <MainLayout>
            {toolbar}
            <Box sx={{ mt: 3 }}>
                {table}
            </Box>
            <Box sx={{ mt: 3 }}>
                {pagination}
            </Box>
            
            {dialogs}
        </MainLayout>
    );
}