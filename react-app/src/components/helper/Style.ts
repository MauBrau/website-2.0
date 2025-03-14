import { createTheme } from "@mui/material";
declare module "@mui/material/styles" {
    interface Palette {
        transparent: Palette["primary"];
    }

    interface PaletteOptions {
        transparent?: PaletteOptions["primary"];
    }
}

export const theme = createTheme({
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

export const nameFont = 'birthstone bounce';
export const textFont = 'bagel fat one';

// Common colours used in scene:
export const DEFAULT_SUN = '#F9DB5A';
export const DEFAULT_TRUNK = '#3f3e3d';
export const LIGHT_GRAY = 'lightgray';
export const WHITE = 'white';
export const WINDOW_FRAME = "#9ea7ae";
export const DAY_RAIN_SKY = "dayRain";
export const NIGHT_RAIN_SKY = 'nightRain';
export const SUNRISE_SKY = 'sunrise';
export const SUNSET_SKY = 'sunset';
export const NIGHT_SKY = 'night';
export const DAY_SKY = 'day';