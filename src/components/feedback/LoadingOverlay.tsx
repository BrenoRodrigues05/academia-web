import {

Backdrop,

CircularProgress,

} from "@mui/material";

type Props = {

    open: boolean;

};

export default function LoadingOverlay({

    open,

}: Props) {

    return (

        <Backdrop

            open={open}

            sx={{

                zIndex: (theme) =>

                    theme.zIndex.drawer + 10,

            }}

        >

            <CircularProgress />

        </Backdrop>

    );

}