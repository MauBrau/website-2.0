import { createTheme } from "@mui/material";

const theme = createTheme({
    components: {},
    palette: {
        primary: {
            light: "#757ce8",
            main: "#C7E6FC",
            dark: "#002884",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff7961",
            main: "#352e34",
            dark: "#ba000d",
            contrastText: "#000",
        },
    },
});

export default theme;