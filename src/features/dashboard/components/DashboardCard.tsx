import {
Card,
CardContent,
Stack,
Typography,
} from "@mui/material";

type Props = {
title: string;
value: number;
icon: React.ReactNode;
};

export default function DashboardCard({
title,
value,
icon,
}: Props) {
return (
<Card>
<CardContent>
<Stack spacing={2}>

{icon}

<Typography variant="h6">

{title}

</Typography>

<Typography variant="h3">

{value}

</Typography>

</Stack>

</CardContent>

</Card>

);

}