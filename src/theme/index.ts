import { createTheme } from "@mui/material/styles";

import { palette } from "./palette";
import { typography } from "./typography";
import { breakpoints } from "./breakpoints";
import { components } from "./components";
import { shadows } from "./shadows";

const theme = createTheme({
    palette,
    typography,
    breakpoints,
    components,
    shadows,
});

export default theme;