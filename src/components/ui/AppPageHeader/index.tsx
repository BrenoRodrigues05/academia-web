import {
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function AppPageHeader({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4, 
      }}
    >
      <div>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </div>

      {action}
    </Stack>
  );
}