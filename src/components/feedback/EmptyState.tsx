import {

Box,

Typography,

} from "@mui/material";

type Props = {

    message: string;

};

export default function EmptyState({

    message,

}: Props) {

    return (

        <Box 
            sx={{ 
                py: 6, 
                textAlign: "center" 
            }}
        >

            <Typography

                color="text.secondary"

            >

                {message}

            </Typography>

        </Box>

    );

}