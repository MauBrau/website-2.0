import { createTheme } from "@mui/material";

export const nameFont = 'birthstone bounce';
export const stylizedTextFont = 'bagel fat one';
export const textFont = 'montserrat';
export const formalFont = 'Raleway';

export const TRANSPARENT = "#00000000";
export const BACKGROUND_BROWN = "#352E34";
export const PRIMARY_COLOUR = "#C7E6FC";
export const SECONDARY_COLOUR = "#9ECAC1";

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


export let theme = createTheme({});
theme = createTheme(theme, {
    palette: {
        primary: theme.palette.augmentColor({
            color: {
                main: `${PRIMARY_COLOUR}`,
            },
        }),
        secondary: theme.palette.augmentColor({
            color: {
                main: `${SECONDARY_COLOUR}`,
            },
        })
    }
});