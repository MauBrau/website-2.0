import { createTheme } from "@mui/material";
declare module "@mui/material/styles" {
    interface Palette {
        transparent: Palette["primary"];
    }

    interface PaletteOptions {
        transparent?: PaletteOptions["primary"];
    }
}
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
        transparent: {
            main: "#0000000",
        },
    },
});

export default theme;
