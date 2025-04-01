import { createTheme } from "@mui/material";
declare module "@mui/material/styles" {
    interface Palette {
        appBarBackground: Palette['appBar'];
    }

    interface PaletteOptions {
        appBarBackground?: PaletteOptions['appBar'];
    }
}

declare module '@mui/material/AppBar' {
    interface AppBarPropsColorOverrides {
        appBar: true;
    }
}

export let theme = createTheme({});
theme = createTheme(theme, {
    palette: {
        primary: theme.palette.augmentColor({
            color: {
                main: "#C7E6FC",
            },
        }),
        secondary: {
            light: "#ff7961",
            main: "#DD7373",
            dark: "#ba000d",
            contrastText: "#000",
        },
        appBar: {
            main: "#352e34",
            backgroundColor: "#352e34",
        }
    },
});
console.log('theme?');
console.log(theme);

export const nameFont = 'birthstone bounce';
export const stylizedTextFont = 'bagel fat one';
export const textFont = 'montserrat';

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