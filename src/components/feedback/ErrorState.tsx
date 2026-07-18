import {

Alert,

Button,

Stack,

} from "@mui/material";

type Props = {

    message: string;

    onRetry?: () => void;

};

export default function ErrorState({

    message,

    onRetry,

}: Props) {

    return (

        <Stack spacing={2}>

            <Alert severity="error">

                {message}

            </Alert>

            {

                onRetry && (

                    <Button

                        onClick={onRetry}

                    >

                        Tentar novamente

                    </Button>

                )

            }

        </Stack>

    );

}