import type { ThemeOptions } from "@mui/material/styles";

export const typography: Required<ThemeOptions>["typography"] = {
  fontFamily: [
    "Inter",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ].join(","),

  h4: {
    fontWeight: 700,
  },

  h5: {
    fontWeight: 700,
  },

  h6: {
    fontWeight: 600,
  },

  button: {
    textTransform: "none",
    fontWeight: 600,
  },
};