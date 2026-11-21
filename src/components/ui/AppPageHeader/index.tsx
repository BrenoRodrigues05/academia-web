import { Box, Stack, Typography } from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function AppPageHeader({ title, subtitle, action }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 4,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "stretch", gap: 2 }}>
        <Box
          sx={{
            width: 4,
            borderRadius: 4,
            bgcolor: "primary.main",
            boxShadow: "0 0 16px rgba(198,255,61,0.5)",
          }}
        />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: -0.5 }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {action}
    </Stack>
  );
}