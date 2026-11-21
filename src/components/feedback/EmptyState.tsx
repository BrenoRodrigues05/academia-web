import { Box, Typography } from "@mui/material";
import { InboxOutlined } from "@mui/icons-material";

type Props = {
    message: string;
    };

    export default function EmptyState({ message }: Props) {
    return (
        <Box
        sx={{
            py: 8,
            px: 3,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 3,
        }}
        >
        <InboxOutlined
            sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5, mb: 1 }}
        />
        <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
            {message}
        </Typography>
        </Box>
    );
}