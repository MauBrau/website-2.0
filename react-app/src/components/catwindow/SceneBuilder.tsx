import React, { useEffect, useState } from "react";
import "./CatWindow.css";
import { Weather, WeatherMain } from "../../interface/IWeather";
import {
    BACKGROUND_BROWN,
    DAY_RAIN_SKY,
    DAY_SKY,
    DEFAULT_SUN,
    DEFAULT_TRUNK,
    LIGHT_GRAY,
    NIGHT_RAIN_SKY,
    NIGHT_SKY,
    PRIMARY_COLOUR,
    SUNRISE_SKY,
    SUNSET_SKY,
    WHITE,
    WINDOW_FRAME,
} from "../helper/Style";
import { DateTime } from "luxon";
import { useMediaQuery } from "@mui/material";

export interface Palette {
    sky: string;
    sun: string;
    building: string;
    window: string;
    windowFrame: string;
    cloud: string;
    closeHill: string;
    midHill: string;
    farHill: string;
    tree1: string;
    tree2: string;
    trunk: string;
}

interface SceneProps {
    weatherInfo: Weather | undefined;
}

interface SceneValues {
    weather: WeatherState;
    isWinter: Boolean;
    time: TimeOfDay;
    temp: number;
}

enum WeatherState {
    Clear = "Clear Skies",
    Cloudy = "Cloudy",
    PartlyCloudy = "Partly Cloudy",
    Rainy = "Raining",
    Snowy = "Snowing",
}

enum TimeOfDay {
    Sunrise = "Sunrise",
    Day = "Day",
    Sunset = "Sunset",
    Night = "Night",
}
// Used for sunset/sunrise windows. While those only last about 30 minutes in reality,
// it's too pretty to skip for the window so we're making them an hour long
const HOUR = 3600;
// Fallback sunrise/sunset times - 7am and 7pm
const SUNRISE = DateTime.now().set({ hour: 7 }).toUnixInteger();
const SUNSET = DateTime.now().set({ hour: 19 }).toUnixInteger();

const DEFAULT_WINDOW_SIZE = 400;
const DEFAULT_FRAME_WIDTH = 16;

function SceneBuilder({ weatherInfo }: SceneProps) {
    const fixed = weatherInfo === undefined;
    const isDesktop = useMediaQuery("(min-width:600px)");
    const currentTime: DateTime = DateTime.now().setZone("America/Toronto");
    const currentTimeUnix: number = currentTime.toUnixInteger();

    var scene: SceneValues = createScene();

    if (scene === undefined) {
        return <div />;
    }

    const palette = generatePalette();
    const isSnowy = scene.weather === WeatherState.Snowy;
    const isRainy = scene.weather === WeatherState.Rainy;
    const showSunOrMoon = !isSnowy && !isRainy;
    var weatherText = fixed
        ? "Weather info unavailable"
        : `Weather in Montreal:  ${Math.round(scene.temp)} °C, ${
              scene.weather
          }`;

    const SCENE_SIZE: number = isDesktop ? 400 : 300;
    return (
        <div
            className="windowView"
            style={{ width: SCENE_SIZE, height: SCENE_SIZE }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${DEFAULT_WINDOW_SIZE} ${DEFAULT_WINDOW_SIZE}`}
            >
                <defs>
                    <clipPath id="window-frame-clip">
                        <rect
                            x={DEFAULT_FRAME_WIDTH / 2}
                            y="0"
                            width={`${
                                DEFAULT_WINDOW_SIZE - DEFAULT_FRAME_WIDTH
                            }px`}
                            height={`${DEFAULT_WINDOW_SIZE}px`}
                        />
                    </clipPath>
                </defs>
                <g clipPath="url(#window-frame-clip)">
                    <defs>
                        <Gradients />
                    </defs>
                    <BaseScene />
                </g>
                <Frame />
                <Cat />
            </svg>
            <div className="weatherInfo" style={{ color: `${PRIMARY_COLOUR}` }}>
                <p>{weatherText}</p>
            </div>
        </div>
    );

    function createScene(): SceneValues {
        var scene: SceneValues = {
            weather:
                weatherInfo === undefined
                    ? WeatherState.PartlyCloudy
                    : getWeatherFromId(weatherInfo.weather),
            isWinter: getWinter(),
            time: getTimeOfDay(),
            temp: weatherInfo === undefined ? 0 : weatherInfo.main.feels_like,
        };

        return scene;
    }

    function getWeatherFromId(weatherMain: WeatherMain[]): WeatherState {
        var weatherResult;
        if (weatherMain.length === 1) {
            weatherResult = determineWeather(weatherMain[0].id);
        } else {
            // IWeather.ts describes my chosen priority
            // Look through all the returned weather info and see if it contains a high priority ID
            var index = weatherMain.findIndex((w) => w.id >= 600 && w.id < 700);
            if (index < 0) {
                index = weatherMain.findIndex((w) => w.id >= 200 && w.id < 600);
            }
            if (index < 0) {
                index = weatherMain.findIndex((w) => w.id >= 700 && w.id < 800);
            }
            if (index < 0) {
                index = weatherMain.findIndex(
                    (w) => w.id === 803 || w.id === 804
                );
            }
            if (index < 0) {
                index = weatherMain.findIndex(
                    (w) => w.id === 801 || w.id === 802
                );
            }
            if (index < 0) {
                weatherResult = WeatherState.Clear;
            } else {
                weatherResult = determineWeather(weatherMain[index].id);
            }
        }
        return weatherResult;
    }

    function determineWeather(weatherID: number): WeatherState {
        if (weatherID >= 200 && weatherID < 600) {
            // Thunderstorm and rain variants
            return WeatherState.Rainy;
        } else if (weatherID >= 600 && weatherID < 700) {
            return WeatherState.Snowy;
        } else if (
            (weatherID >= 700 && weatherID < 800) ||
            weatherID === 803 ||
            weatherID === 804
        ) {
            return WeatherState.Cloudy;
        } else if (weatherID === 801 || weatherID === 802) {
            return WeatherState.PartlyCloudy;
        } else {
            return WeatherState.Clear;
        }
    }

    function getTimeOfDay(): TimeOfDay {
        var sunrise =
            weatherInfo === undefined ? SUNRISE : weatherInfo.sys.sunrise;
        var sunset =
            weatherInfo === undefined ? SUNSET : weatherInfo.sys.sunset;

        if (currentTimeUnix > sunrise && currentTimeUnix < sunset - HOUR) {
            return TimeOfDay.Day;
        } else if (currentTimeUnix > sunset) {
            return TimeOfDay.Night;
        } else if (
            currentTimeUnix >= sunrise - HOUR &&
            currentTimeUnix <= sunrise
        ) {
            return TimeOfDay.Sunrise;
        } else {
            return TimeOfDay.Sunset;
        }
    }

    function getWinter(): Boolean {
        var month = currentTime.month;
        // If it's November, December, January, February, or March, it's winter
        // 2025 update: remember when it snowed in November? Good times. Removing November from Winter.
        if (month === 12 || (month >= 1 && month < 4)) {
            return true;
        }
        return false;
    }

    function generatePalette(): Palette {
        if (
            scene.weather === WeatherState.Rainy ||
            scene.weather === WeatherState.Snowy
        ) {
            if (scene.time !== TimeOfDay.Night) {
                return {
                    sky: DAY_RAIN_SKY,
                    sun: DEFAULT_SUN,
                    building: "#4a5767",
                    window: LIGHT_GRAY,
                    windowFrame: WINDOW_FRAME,
                    cloud: LIGHT_GRAY,
                    closeHill: "#205b38",
                    midHill: "#2b844f",
                    farHill: "#36a563",
                    tree1: "#7ca83f",
                    tree2: "#648931",
                    trunk: "rgb(124, 108, 81)",
                };
            } else {
                return {
                    sky: NIGHT_RAIN_SKY,
                    sun: DEFAULT_SUN,
                    building: "#12110d",
                    window: "#e5fffa",
                    windowFrame: WINDOW_FRAME,
                    cloud: "#4d4e51",
                    closeHill: "#2b4c63",
                    midHill: "#396584",
                    farHill: "#618ba8",
                    tree1: "#394651",
                    tree2: "#14212d",
                    trunk: DEFAULT_TRUNK,
                };
            }
        } else {
            if (scene.time === TimeOfDay.Sunset) {
                return {
                    sky: SUNSET_SKY,
                    sun: WHITE,
                    building: "#341c1b",
                    window: "#fff179",
                    windowFrame: "#bf360c",
                    cloud: "#c08b6a",
                    closeHill: "#de9f26",
                    midHill: "#e6ad28",
                    farHill: "#ebbd53",
                    tree1: "#90963c",
                    tree2: "#747c0b",
                    trunk: DEFAULT_TRUNK,
                };
            } else if (scene.time === TimeOfDay.Night) {
                return {
                    sky: NIGHT_SKY,
                    sun: WHITE,
                    building: "#131e29",
                    window: "#d7fcf5",
                    windowFrame: "#02050a",
                    cloud: "#4a626c",
                    closeHill: "#38617e",
                    midHill: "#508bb5",
                    farHill: "#73a2c3",
                    tree1: "#495662",
                    tree2: "#1c2c3b",
                    trunk: DEFAULT_TRUNK,
                };
            } else if (scene.time === TimeOfDay.Sunrise) {
                return {
                    sky: SUNSET_SKY,
                    sun: "#ffffda",
                    building: "#ba909a",
                    window: "#f6a5c0",
                    windowFrame: "#dd949e",
                    cloud: "#eb70a1",
                    closeHill: "#ad7b77",
                    midHill: "#c4918d",
                    farHill: "#cfa7a3",
                    tree1: "#d89449",
                    tree2: "#ce791c",
                    trunk: DEFAULT_TRUNK,
                };
            } else {
                return {
                    sky: DAY_SKY,
                    sun: DEFAULT_SUN,
                    building: "#b4bec8",
                    window: WHITE,
                    windowFrame: "#979d9c",
                    cloud: WHITE,
                    closeHill: "rgb(46, 130, 80)",
                    midHill: "rgb(59, 175, 106)",
                    farHill: "rgb(66, 196, 119)",
                    tree1: "rgb(160, 215, 85)",
                    tree2: "rgb(136, 183, 73)",
                    trunk: "rgb(124, 108, 81)",
                };
            }
        }
    }

    function BaseScene() {
        return (
            <g>
                <Sky />
                {scene.time === TimeOfDay.Night && (!isSnowy || !isRainy) ? (
                    <Stars />
                ) : null}
                {showSunOrMoon ? (
                    scene.time === TimeOfDay.Night ? (
                        <Moon />
                    ) : (
                        <Sun />
                    )
                ) : null}
                <Clouds />
                <City />
                <Land />
                <Trees />
                {isSnowy ? <Snow /> : null}
                {isRainy ? <Rain /> : null}
            </g>
        );
    }

    function Gradients() {
        return (
            <>
                <radialGradient id={`${DAY_SKY}-sky`} cx="50%" cy="0%">
                    <stop offset="0%" stopColor="#bdddf9" />
                    <stop offset="100%" stopColor="#91bae0" />
                </radialGradient>
                <radialGradient id={`${DAY_RAIN_SKY}-sky`} cx="50%" cy="0%">
                    <stop offset="0%" stopColor="#b8b9d8" />
                    <stop offset="100%" stopColor="#9899ad" />
                </radialGradient>
                <linearGradient id={`${SUNRISE_SKY}-sky`} y2="1">
                    <stop stopColor="#e08594" />
                    <stop offset="1" stopColor="#ffd596" />
                </linearGradient>
                <linearGradient id={`${SUNSET_SKY}-sky`} x1="1" x2="0" y2="1">
                    <stop stopColor="#ffcb32" />
                    <stop offset="1" stopColor="yellow" />
                </linearGradient>
                <radialGradient id={`${NIGHT_SKY}-sky`} cx="50%" cy="0%">
                    <stop offset="0%" stopColor="#2454c1" />
                    <stop offset="100%" stopColor="#17377f" />
                </radialGradient>
                <radialGradient id={`${NIGHT_RAIN_SKY}-sky`} cx="50%" cy="0%">
                    <stop offset="0%" stopColor="#1e2528" />
                    <stop offset="100%" stopColor="#1e2e30" />
                </radialGradient>
            </>
        );
    }

    function Sky() {
        return (
            <rect
                width="100%"
                height="100%"
                fill={`url(#${palette.sky}-sky)`}
            />
        );
    }

    function Cat() {
        const multiplier: number = 0.5;
        return (
            <g>
                <path
                    d={`m${DEFAULT_WINDOW_SIZE * 0.75} ${
                        DEFAULT_WINDOW_SIZE * multiplier - DEFAULT_FRAME_WIDTH
                    }c5.072-.369 8.267.7 12.75 3 .581.286 1.162.572 1.761.867 1.418.7 2.83 1.415 4.239 2.133.356-.851.712-1.702 1.078-2.578 1.172-2.672 1.172-2.672 1.922-3.422 4.757.097 7.869 1.931 11.25 5.25.227 .529.454 1.058.689 1.603.268 .461.536 .922.811 1.397 1.241.293 2.493.54 3.75.75 10.322 6.682 14.566 19.94 18.073 31.093.615 1.733 1.312 3.158 2.27 4.72 4.083 7.078 3.744 15.785 3.563 23.719-.066 5.243.161 9.927 1.778 14.968 1.411 4.995 1.379 9.944 1.23 15.082-.024 1.365-.047 2.729-.069 4.094-.037 2.116-.08 4.232-.144 6.347-.28 9.622.621 16.516 4.798 25.227 2.185 6.934 1.937 16.602-1.172 23.109-2.311 3.875-5.208 7.831-9.328 9.891-.793 1.613-1.437 3.265-2.104 4.934-1.921 3.893-4.202 6.037-8.068 7.957-.713.366-1.425.733-2.159 1.11-7.25 2.714-14.679 2.747-22.33 2.66-5.727.096-8.919 1.517-13.339 5.089-.86.635-1.722 1.267-2.587 1.895-.398.297-.796.594-1.206.901-8.212 6.091-16.954 10.547-26.957 12.954-.526.134-1.052.267-1.594.405-6.574 1.45-13.184 1.322-19.88 1.291-2.047-.008-4.094 0-6.141.01-21.302.019-21.302.019-27.135-5.455-7.081-8.643-6.016-20.221-5.25-30.75 1.609-11.817 6.501-24.846 16.219-32.25 1.999-.842 3.383-.989 5.531-.75.75 .75.75 .75.946 3.12-.22 3.223-1.012 4.911-2.587 7.708-5.151 9.678-9.278 21.337-6.562 32.344 1.439 3.936 3.613 5.824 7.298 7.799 7.762 3.273 17.774 2.278 25.518-.478 7.761-3.228 14.54-7.059 21.138-12.243-.299-.699-.597-1.398-.905-2.118-10.009-23.864-6.891-47.86 2.282-71.51 3.779-9.181 8.035-18.346 13.532-26.628 1.325-2.745 1.024-5.279.853-8.263-.023-4.863.817-10.889 2.988-15.231-.418-.062-.835-.124-1.266-.187-3.356-1.088-5.983-3.544-7.734-6.562-.224-2.073-.321-3.932-.281-6 .007-.567.014-1.134.021-1.718.218-8.185 2.24-15.509 7.256-22.088.838-2.815-.53-5.189-1.605-7.787-.323-.819-.323-.819-.652-1.655-.772-1.948-1.551-3.876-2.489-5.751z`}
                    fill={BACKGROUND_BROWN}
                />
            </g>
        );
    }

    function Frame() {
        return (
            <g id="window-frame">
                <rect
                    id="frame-white"
                    width={`${
                        DEFAULT_WINDOW_SIZE - DEFAULT_FRAME_WIDTH * 2 + 2
                    }`}
                    height={`${DEFAULT_WINDOW_SIZE - DEFAULT_FRAME_WIDTH * 3}`}
                    stroke="white"
                    strokeWidth={16}
                    fillOpacity={0}
                    strokeOpacity={1}
                    x={15}
                    y={8}
                />
                <rect
                    id="frame-inner-horizontal"
                    width={`${DEFAULT_WINDOW_SIZE - DEFAULT_FRAME_WIDTH * 2}`}
                    height={4}
                    fill="white"
                    x={DEFAULT_FRAME_WIDTH}
                    y={`${DEFAULT_WINDOW_SIZE / 2 - DEFAULT_FRAME_WIDTH - 2}`}
                />
                <rect
                    id="frame-inner-vertical"
                    width={4}
                    height={`${DEFAULT_WINDOW_SIZE - DEFAULT_FRAME_WIDTH * 2}`}
                    fill="white"
                    x={`${DEFAULT_WINDOW_SIZE / 2 - 2}`}
                    y={DEFAULT_FRAME_WIDTH}
                />
                <rect
                    id="frame-base"
                    width={`${DEFAULT_WINDOW_SIZE}`}
                    height={DEFAULT_FRAME_WIDTH * 2}
                    fill="#cccbc9"
                    y={`${DEFAULT_WINDOW_SIZE - DEFAULT_FRAME_WIDTH * 2}`}
                />
            </g>
        );
    }

    function Trees() {
        if (scene.isWinter) {
            // M 68.487 306.771 C 68.532 306.853 68.39 269.839 67.429 259.418 C 68.149 258.666 49.489 228.65 48.405 228.464 L 50.468 225.823 L 66.971 251.107 C 66.971 251.98 68.881 204.075 68.881 204.013 L 72.058 204.211 C 71.608 204.211 70.662 242.054 70.73 242.054 L 90.411 214.259 L 92.102 217.345 L 76.032 239.987 C 75.561 240.697 71.158 241.212 72.43 269.384 C 73.702 297.555 73.316 305.124 73.455 306.8 L 68.487 306.771 Z
            return (
                <g>
                    {/* Biggest */}
                    <path
                        fill={palette.trunk}
                        d="M 344.764 334.685 C 344.859 334.863 344.554 255.162 342.485 232.724 C 344.035 231.103 303.854 166.471 301.521 166.073 L 305.964 160.386 L 341.497 214.828 C 341.497 216.708 345.61 113.557 345.61 113.424 L 352.451 113.849 C 351.482 113.849 349.447 195.335 349.591 195.335 L 391.972 135.484 L 395.612 142.129 L 361.009 190.884 C 359.994 192.413 350.514 193.52 353.254 254.182 C 355.991 314.84 355.161 331.14 355.461 334.748 L 344.764 334.685 Z"
                    />
                    {/* First, on the left*/}
                    <path
                        fill={palette.trunk}
                        d="M 68.487 306.771 C 68.532 306.853 68.39 269.839 67.429 259.418 C 68.149 258.666 49.489 228.65 48.405 228.464 L 50.468 225.823 L 66.971 251.107 C 66.971 251.98 68.881 204.075 68.881 204.013 L 72.058 204.211 C 71.608 204.211 70.662 242.054 70.73 242.054 L 90.411 214.259 L 92.102 217.345 L 76.032 239.987 C 75.561 240.697 71.158 241.212 72.43 269.384 C 73.702 297.555 73.316 305.124 73.455 306.8 L 68.487 306.771 Z"
                    />
                    {/* Smallest */}
                    <path
                        fill={palette.trunk}
                        d="M 100.391 302.44 C 100.426 302.505 100.314 273.299 99.556 265.077 C 100.124 264.483 88.421 260.784 87.566 260.638 L 89.659 258.321 L 99.194 261.075 C 99.194 261.764 100.003 226.521 100.003 226.472 L 102.976 226.628 C 102.621 226.628 102.107 251.376 102.16 251.376 L 113.042 242.225 L 113.68 244.66 L 106.344 249.745 C 105.972 250.305 102.498 250.711 103.502 272.94 C 104.505 295.168 104.201 301.141 104.311 302.463 L 100.391 302.44 Z"
                    />
                </g>
            );
        }
        return (
            <g>
                <rect
                    x="341.346"
                    y="313.914"
                    width="16.403"
                    height="21.493"
                    fill={palette.trunk}
                />
                <path
                    fill={palette.tree1}
                    d="M 399.549 261.593 C 399.549 293.111 376.917 318.661 348.989 318.661 C 321.06 318.661 298.414 293.104 298.414 261.593 C 298.414 188.204 321.06 106.679 348.989 106.679 C 376.917 106.679 399.549 188.204 399.549 261.593 Z"
                />

                <rect
                    x="67.309"
                    y="291.29"
                    width="6.222"
                    height="14.705"
                    fill={palette.trunk}
                />
                <path
                    fill={palette.tree2}
                    d="M 96.227 266.852 C 96.227 282.56 84.733 295.293 70.55 295.293 C 56.367 295.293 44.866 282.556 44.866 266.852 C 44.866 230.276 56.367 189.646 70.55 189.646 C 84.733 189.646 96.227 230.276 96.227 266.852 Z"
                />

                <rect
                    x="99.265"
                    y="290.159"
                    width="5.656"
                    height="12.443"
                    fill={palette.trunk}
                />
                <path
                    fill={palette.tree1}
                    d="M 119.994 274.121 C 119.994 285.288 111.823 294.34 101.741 294.34 C 91.658 294.34 83.482 285.285 83.482 274.121 C 83.482 248.12 91.658 219.236 101.741 219.236 C 111.823 219.236 119.994 248.12 119.994 274.121 Z"
                />
            </g>
        );
    }

    function Land() {
        var farHill = palette.farHill;
        var midHill = palette.midHill;
        var closeHill = palette.closeHill;
        if (
            scene.isWinter &&
            scene.weather !== WeatherState.Snowy &&
            scene.weather !== WeatherState.Rainy
        ) {
            if (scene.time === TimeOfDay.Day) {
                farHill = "#f9fafc";
                midHill = "#ebeef3";
                closeHill = "#e1e8ef";
            } else if (scene.time === TimeOfDay.Sunrise) {
                farHill = "#fcf9f9";
                midHill = "#f2eaea";
                closeHill = "#efe1e1";
            } else if (scene.time === TimeOfDay.Sunset) {
                farHill = "#fcfaf9";
                midHill = "#f2efea";
                closeHill = "#efe9e1";
            } else {
                farHill = "#e8ebf2";
                midHill = "#dadfe8";
                closeHill = "#ccd6e0";
            }
        } else if (scene.isWinter) {
            farHill = "#e8ebf2";
            midHill = "#dadfe8";
            closeHill = "#ccd6e0";
        }

        const closeHeight = DEFAULT_WINDOW_SIZE * 0.7;
        const midHeight = DEFAULT_WINDOW_SIZE * 0.7;
        const farHeight = DEFAULT_WINDOW_SIZE * 0.6;
        return (
            <g id="land">
                <path
                    id="land-far"
                    fill={farHill}
                    // d={`M 0.741 272.444 C 103.909 235.368 375.944 240.152 ${SCENE_SIZE} 240.152 L ${SCENE_SIZE} 306.428 L 0.741 306.024 L 0.741 272.444 Z`}
                    d={`M ${DEFAULT_WINDOW_SIZE} ${DEFAULT_WINDOW_SIZE} H -${DEFAULT_WINDOW_SIZE} S 0 ${farHeight} ${DEFAULT_WINDOW_SIZE} ${farHeight}`}
                />
                <path
                    id="land-mid"
                    fill={midHill}
                    // d={`M ${SCENE_SIZE} ${SCENE_SIZE} H 0 S 0 ${midHeight} ${SCENE_SIZE} ${midHeight}`}
                    d={`m 0 ${DEFAULT_WINDOW_SIZE} V ${midHeight} s ${DEFAULT_WINDOW_SIZE} 0 ${DEFAULT_WINDOW_SIZE} ${
                        DEFAULT_WINDOW_SIZE / 2
                    }`}
                    //d={`M 0.741 298.57 C 103.909 335.646 375.944 330.862 363.869 330.862 L ${SCENE_SIZE} 264.586 L 0.741 264.99 L 0.741 298.57 Z`}
                    // d={`M 0 ${SCENE_SIZE * 0.8} C ${SCENE_SIZE/4} ${SCENE_SIZE * 0.8} ${SCENE_SIZE * 0.9} ${SCENE_SIZE/1.5} ${SCENE_SIZE} ${SCENE_SIZE * 0.75} L ${SCENE_SIZE} ${SCENE_SIZE} 0 ${SCENE_SIZE}`}
                />
                <path
                    id="land-close"
                    fill={closeHill}
                    //d={`M 0 ${SCENE_SIZE} H ${SCENE_SIZE * 2} S ${SCENE_SIZE} ${closeHeight} 0 ${closeHeight}`}
                    //d={`M ${SCENE_SIZE} ${SCENE_SIZE} H -${SCENE_SIZE} S 0 ${closeHeight} ${SCENE_SIZE} ${closeHeight}`}
                    d={`M ${DEFAULT_WINDOW_SIZE} ${
                        DEFAULT_WINDOW_SIZE * 0.75
                    } C 173 290 84 308 19 343 S -40 383 -55 ${DEFAULT_WINDOW_SIZE} H ${DEFAULT_WINDOW_SIZE}`}
                    // d={`M 0 ${SCENE_SIZE * 0.8} C ${SCENE_SIZE/4} ${SCENE_SIZE * 0.8} ${SCENE_SIZE * 0.9} ${SCENE_SIZE/1.5} ${SCENE_SIZE} ${SCENE_SIZE * 0.75} L ${SCENE_SIZE} ${SCENE_SIZE} 0 ${SCENE_SIZE}`}
                />
            </g>
        );
    }

    function City() {
        var buildingColour: string = palette.building;
        var windowColour: string = palette.window;
        var windowBorder: string = palette.windowFrame;
        // TODO: lots of duplicating, maybe we generate window/building positions in a loop eventually?
        // const defaultY : number = 300;
        // // Technically it's "reversed" - the building is bigger the higher the number
        // const heightMax : number = 180;
        // const heightMin : number = 85;

        // const buildingCount : number = 10;

        // const buildings = [];
        // const buildingWidth = 50;
        // let buildingX = 0;
        // for(let i = 0; i < buildingCount; i++) {
        //     const buildingY = Math.random() * (heightMax - heightMin + 1) + heightMin;
        //     buildings.push(<rect
        //         id={`"city-building-${i+1}"`}
        //         x={buildingX}
        //         y={`${buildingY}`}
        //         width={`${buildingWidth}`}
        //         height={`${defaultY}`}
        //         fill={buildingColour}
        //     />);

        //     // const buildingHeight = defaultY + buildingY;
        //     // // Windows for building
        //     // for (let y = 0; y < 3; y++) {
        //     //     const windowY = `${Math.random() * buildingY + 1}`;
        //     //     const windowX = `${Math.random() * buildingX + 1}`;
        //     //     buildings.push(<rect
        //     //         id={`"city-building-${i+1}-window-${y+1}"`}
        //     //         x={windowX}
        //     //         y={windowY}
        //     //         width="13"
        //     //         height="13"
        //     //         fill={windowColour}
        //     //         stroke={windowBorder}
        //     //     />);
        //     // }
        //     buildingX += buildingWidth;
        // }
        return (
            <g id="city">
                {/* { buildings } */}
                {/* 6 buildings */}
                <rect
                    id="city-building-1"
                    x="300"
                    y="125"
                    width="100"
                    height="150"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-2"
                    x="85"
                    y="125"
                    width="45"
                    height="140"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-3"
                    x="195"
                    y="155"
                    width="45"
                    height="115"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-4"
                    x="1"
                    y="110"
                    width="95"
                    height="170"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-5"
                    x="235"
                    y="110"
                    width="70"
                    height="160"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-6"
                    x="125"
                    y="90"
                    width="80"
                    height="175"
                    fill={buildingColour}
                />

                {/* Multiple windows */}
                <rect
                    id="city-window-1"
                    x="20"
                    y="135"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-2"
                    x="55"
                    y="160"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-3"
                    x="150"
                    y="125"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-4"
                    x="215"
                    y="185"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-5"
                    x="145"
                    y="195"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-6"
                    x="260"
                    y="135"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-7"
                    x="265"
                    y="205"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-8"
                    x="100"
                    y="155"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-9"
                    x="180"
                    y="215"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-10"
                    x="25"
                    y="210"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-11"
                    x="285"
                    y="160"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-12"
                    x="350"
                    y="180"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-13"
                    x="370"
                    y="150"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-14"
                    x="315"
                    y="190"
                    width="13"
                    height="13"
                    fill={windowColour}
                    stroke={windowBorder}
                />
            </g>
        );
    }

    function Sun() {
        var colour: string = palette.sun;
        const daySunX: string = "50%";
        const daySunY: string = "12.5%";
        const sunsetSunX: string = "7.5%";
        const sunriseSunX: string = "87.5%";
        const sunSetOrRiseY: string = "25%";

        var cx = daySunX;
        var cy = daySunY;
        if (scene.time === TimeOfDay.Sunset) {
            cx = sunsetSunX;
            cy = sunSetOrRiseY;
        } else if (scene.time === TimeOfDay.Sunrise) {
            cx = sunriseSunX;
            cy = sunSetOrRiseY;
        }
        return (
            <g id="sun">
                <circle
                    id="sun-far-ring"
                    fill={colour}
                    fillOpacity="0.1"
                    cx={cx}
                    cy={cy}
                    r="42"
                />
                <circle
                    id="sun-mid-ring"
                    fill={colour}
                    fillOpacity="0.3"
                    cx={cx}
                    cy={cy}
                    r="30"
                />
                <circle id="sun-whole" fill={colour} cx={cx} cy={cy} r="20" />
            </g>
        );
    }

    function Moon() {
        const x = SCENE_SIZE / 2;
        const y = SCENE_SIZE * 0.225;
        return (
            <g id="moon">
                <path
                    transform="rotate(-15)"
                    fill={WHITE}
                    d={`m ${x} ${y} c -8.894 -11.106 -26.476 -8.422 -31.649 4.834 -5.172 13.255 5.944 27.139 20.01 24.992 4.585-.7 8.739-3.099 11.639-6.72-8.894 5.898-20.837-.041-21.5-10.692-.661-10.651 10.454-18.025 20.01-13.273.514.256 1.011.543 1.49.859z`}
                />
            </g>
        );
    }

    function Clouds() {
        var cloud = palette.cloud;

        if (scene.weather === WeatherState.Clear) {
            return <g />;
        }

        var showAllClouds = scene.weather !== WeatherState.PartlyCloudy;
        return (
            <g id="clouds">
                {/* 7 on rainy/snow/cloudy day, 4 on partly cloudy */}
                {/* Furthest to the right */}
                <path
                    id="cloud-1"
                    className="cloud c1"
                    fill={cloud}
                    d="M 397.286 45.861 C 401.69 45.861 405.299 48.49 405.299 51.699 C 405.299 54.907 401.692 57.536 397.286 57.536 L 362.946 57.536 L 361.802 57.536 C 355.483 57.536 350.358 53.802 350.358 49.197 C 350.358 44.592 356.507 43.989 362.829 43.989 C 363.358 43.857 371.942 32.975 380.116 34.187 C 388.181 35.383 396.145 37.211 396.145 45.861 L 397.286 45.861 Z"
                    //transform="matrix(1, 0, 0, 1, -50, 0)"
                ></path>
                {/* Second from the right */}
                <path
                    id="cloud-2"
                    className="cloud c2"
                    fill={cloud}
                    d="M 330.508 21.21 C 340.217 21.21 348.172 23.584 348.172 26.482 C 348.172 29.379 340.222 31.754 330.508 31.754 L 254.805 31.754 L 252.286 31.754 C 238.353 31.754 227.054 28.381 227.054 24.223 C 227.054 20.064 240.613 19.519 254.548 19.519 C 254.548 19.519 263.954 10.667 292.658 10.667 C 310.633 10.667 327.989 13.398 327.989 21.21 L 330.508 21.21 Z"
                />

                {/* furthest to the left */}
                <path
                    id="cloud-3"
                    className="cloud c3"
                    fill={cloud}
                    d="M 20.872 79.751 C 25.276 79.751 28.885 82.38 28.885 85.589 C 28.885 88.797 25.278 91.426 20.872 91.426 L -13.468 91.426 L -14.612 91.426 C -20.931 91.426 -26.056 87.692 -26.056 83.087 C -26.056 78.482 -19.907 77.879 -13.585 77.879 C -13.056 77.747 -4.472 66.865 3.702 68.077 C 11.767 69.273 19.731 71.101 19.731 79.751 L 20.872 79.751 Z"
                />

                {/* third from the left */}
                <path
                    id="cloud-4"
                    className="cloud c4"
                    fill={cloud}
                    d="M 120.268 76.358 C 124.446 76.358 127.868 73.73 127.868 70.52 C 127.868 67.312 124.448 64.683 120.268 64.683 C 118.501 55.85 86.467 58.537 87.696 64.683 L 86.611 64.683 C 80.617 64.683 75.755 68.418 75.755 73.022 C 75.755 77.628 80.615 81.361 86.611 81.361 C 86.611 81.361 91.632 88.032 103.983 88.032 C 111.717 88.032 119.185 85.008 119.185 76.358 L 120.268 76.358 Z"
                />
                {showAllClouds && (
                    <>
                        {/*third from the right, under long one */}
                        <path
                            id="cloud-5"
                            className="cloud c5"
                            fill={cloud}
                            d="M 265.57 74.377 C 269.158 74.377 272.098 76.942 272.098 80.074 C 272.098 83.204 269.16 85.77 265.57 85.77 C 265.57 87.902 237.593 88.16 237.593 85.77 L 236.662 85.77 C 231.513 85.77 227.337 82.125 227.337 77.633 C 227.337 73.139 231.512 69.495 236.662 69.495 C 236.662 69.495 240.974 62.986 251.582 62.986 C 258.225 62.986 264.639 65.937 264.639 74.377 L 265.57 74.377 Z"
                        />
                        {/* second from the left */}
                        <path
                            id="cloud-6"
                            className="cloud c6"
                            fill={cloud}
                            d="M 73.379 29.781 C 78.191 29.781 82.134 33.3 82.134 37.599 L 82.134 37.599 C 82.134 41.895 78.194 45.416 73.379 45.416 L 35.857 45.416 L 34.608 45.416 C 27.703 45.416 22.102 40.414 22.102 34.249 C 22.102 28.081 27.701 23.081 34.608 23.081 C 34.608 23.081 40.392 14.148 54.619 14.148 C 63.528 14.148 72.131 18.197 72.131 29.781 L 73.379 29.781 Z"
                        />
                        {/* middle */}
                        <path
                            id="cloud-7"
                            className="cloud c7"
                            fill={cloud}
                            d="M 199.699 37.329 C 205.916 37.329 211.011 42.121 211.011 47.975 C 211.011 53.825 205.92 58.62 199.699 58.62 C 201.931 61.968 154.938 64.2 151.218 58.62 L 149.604 58.62 C 140.682 58.62 138.79 54.484 133.445 43.413 C 128.1 32.342 133.989 24.86 149.604 28.205 C 145.758 20.513 155.185 9.347 175.459 16.04 C 186.072 19.544 195.778 29.631 198.086 37.329 L 199.699 37.329 Z"
                        />
                    </>
                )}
            </g>
        );
    }

    function Stars() {
        return (
            <g id="stars">
                <circle
                    id="star-1"
                    fill="rgb(135, 214, 214"
                    opacity="0.3"
                    cx="276.584"
                    cy="50.905"
                    r="1.265"
                />
                <circle
                    id="star-2"
                    fill="rgb(135, 214, 214"
                    opacity="0.3"
                    cx="245.231"
                    cy="44.011"
                    r="1.265"
                />
                <circle
                    id="star-3"
                    fill="rgb(135, 214, 214"
                    opacity="0.3"
                    cx="37.231"
                    cy="59.265"
                    r="1.265"
                />
                <circle
                    id="star-4"
                    fill="rgb(135, 214, 214"
                    opacity="0.3"
                    cx="326.231"
                    cy="44.011"
                    r="1.265"
                />
                <circle
                    id="star-5"
                    fill="rgb(135, 214, 214"
                    opacity="0.3"
                    cx="56.231"
                    cy="92.011"
                    r="1.265"
                />
                <circle
                    id="star-6"
                    fill="rgb(135, 214, 214"
                    opacity="0.3"
                    cx="109.231"
                    cy="19.011"
                    r="1.265"
                />
                <circle
                    id="star-7"
                    fill="rgb(135, 214, 214"
                    opacity="0.3"
                    cx="17.231"
                    cy="14.011"
                    r="1.265"
                />
            </g>
        );
    }

    function Snow() {
        return (
            <g id="snow">
                <g fill="#FFF" fillOpacity=".35">
                    <g className="snow s-bottom-layer">
                        <ellipse cx="88" cy="84.5" rx="6" ry="5.5" />
                        <ellipse cx="263" cy="140.5" rx="6" ry="5.5" />
                        <ellipse cx="326" cy="256.5" rx="6" ry="5.5" />
                        <ellipse cx="22" cy="243.5" rx="6" ry="5.5" />
                        <ellipse cx="11" cy="35.5" rx="6" ry="5.5" />
                        <ellipse cx="85" cy="336.5" rx="6" ry="5.5" />
                        <ellipse cx="175" cy="82.5" rx="6" ry="5.5" />
                        <ellipse cx="126" cy="3.5" rx="6" ry="5.5" />
                        <ellipse cx="312" cy="345.5" rx="6" ry="5.5" />
                        <ellipse cx="312" cy="21.5" rx="6" ry="5.5" />
                        <ellipse cx="346" cy="154.5" rx="6" ry="5.5" />
                    </g>
                </g>
                <g
                    fill="#FFF"
                    fillOpacity=".42"
                    transform="matrix(1, 0, 0, 1, 25, 25)"
                >
                    <g className="snow s-middle-layer">
                        <ellipse cx="88" cy="84.5" rx="6" ry="5.5" />
                        <ellipse cx="263" cy="140.5" rx="6" ry="5.5" />
                        <ellipse cx="326" cy="256.5" rx="6" ry="5.5" />
                        <ellipse cx="22" cy="243.5" rx="6" ry="5.5" />
                        <ellipse cx="11" cy="35.5" rx="6" ry="5.5" />
                        <ellipse cx="85" cy="336.5" rx="6" ry="5.5" />
                        <ellipse cx="175" cy="82.5" rx="6" ry="5.5" />
                        <ellipse cx="126" cy="3.5" rx="6" ry="5.5" />
                        <ellipse cx="312" cy="345.5" rx="6" ry="5.5" />
                        <ellipse cx="312" cy="21.5" rx="6" ry="5.5" />
                        <ellipse cx="346" cy="154.5" rx="6" ry="5.5" />
                    </g>
                </g>
                <g fill="#FFF" fillOpacity=".5">
                    <g className="snow s-top-layer">
                        <circle cx="67" cy="32" r="8" />
                        <circle cx="195" cy="47" r="8" />
                        <circle cx="260" cy="92" r="8" />
                        <circle cx="48" cy="155" r="8" />
                        <circle cx="126" cy="210" r="8" />
                        <circle
                            cx="263"
                            cy="311"
                            r="8"
                            transform="rotate(180 874 1438)"
                        />
                        <circle
                            cx="318"
                            cy="172"
                            r="8"
                            transform="rotate(180 657 1256)"
                        />
                        <circle
                            cx="339"
                            cy="12"
                            r="8"
                            transform="rotate(180 443 1372)"
                        />
                        <circle
                            cx="16"
                            cy="323"
                            r="8"
                            transform="rotate(180 339 1107)"
                        />
                        <circle
                            cx="10"
                            cy="13"
                            r="8"
                            transform="rotate(180 24 1305)"
                        />
                        <circle cx="8" cy="8" r="8" />
                        <circle cx="267" cy="244" r="8" />
                        <circle cx="290" cy="176" r="8" />
                        <circle cx="685" cy="347" r="8" />
                    </g>
                </g>
            </g>
        );
    }

    function Rain() {
        var smallDrop =
            "M 91.344 187.382 " +
            "C 91.527 187.846 92.138 188.762 93.176 190.129 " +
            "C 94.302 191.539 93.48 193.639 91.696 193.91 " +
            "C 89.912 194.181 88.504 192.419 89.162 190.738 " +
            "C 89.247 190.518 89.366 190.313 89.513 190.129 " +
            "C 90.551 188.762 91.161 187.846 91.344 187.382 Z";
        var bigDrop =
            "M 217.39 241.588 " +
            "C 217.728 242.447 218.855 244.138 220.773 246.663 " +
            "C 222.853 249.268 221.336 253.148 218.04 253.65 " +
            "C 214.743 254.149 212.142 250.894 213.358 247.789 " +
            "C 213.516 247.383 213.735 247.004 214.007 246.663 " +
            "C 215.924 244.138 217.051 242.447 217.39 241.588 Z";
        return (
            <g id="rain">
                <g fill="#FFF" fillOpacity=".35">
                    <g className="rain r-bottom-layer">
                        <path d={smallDrop} />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -50.436746, -148.33049)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 78.347255, -153.436464)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 219.612525, -89.328128)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 221.314516, 133.632719)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 90.828524, 141.008014)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 150.398216, -111.454014)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -58.946702, 145.546657)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -24.906878, -102.376728)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -76.533944, 20.733969)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 230.959133, 28.676595)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 259.325653, -182.370314)"
                        />
                    </g>
                </g>
                <g fill="#FFF" fillOpacity=".42">
                    <g
                        className="rain r-middle-layer"
                        transform="matrix(1, 0, 0, 1, 25, 25)"
                    >
                        <path d={smallDrop} />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -50.436746, -148.33049)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 78.347255, -153.436464)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 219.612525, -89.328128)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 221.314516, 133.632719)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 90.828524, 141.008014)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 150.398216, -111.454014)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -58.946702, 145.546657)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -24.906878, -102.376728)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -76.533944, 20.733969)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 230.959133, 28.676595)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 259.325653, -182.370314)"
                        />
                    </g>
                </g>
                <g fill="#FFF" fillOpacity=".42">
                    <g
                        className="rain r-middle-layer second"
                        transform="matrix(0.75, 0, 0, 0.75, -25, -25)"
                    >
                        <path d={smallDrop} />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -50.436746, -148.33049)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 78.347255, -153.436464)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 219.612525, -89.328128)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 221.314516, 133.632719)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 90.828524, 141.008014)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 150.398216, -111.454014)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -58.946702, 145.546657)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -24.906878, -102.376728)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, -76.533944, 20.733969)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 230.959133, 28.676595)"
                        />
                        <path
                            d={smallDrop}
                            transform="matrix(1, 0, 0, 1, 259.325653, -182.370314)"
                        />
                    </g>
                </g>
                <g fill="#FFF" fillOpacity=".5">
                    <g className="rain r-top-layer">
                        <path d={bigDrop} />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -196.338235, 40.338977)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -187.260949, -76.531086)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -147.547821, -187.727844)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -117.47931, 70.974818)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, 102.644886, -226.873642)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, 108.31819, 88.562061)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -63.582922, -115.676883)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -48.832331, -224.60432)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -215.627469, -225.17165)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, 57.825784, -51.568548)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, 15.276004, -199.074452)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, 140.656022, -3.345464)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -45.995679, 69.840158)"
                        />
                        <path
                            d={bigDrop}
                            transform="matrix(1, 0, 0, 1, -115.777318, -90.147015)"
                        />
                    </g>
                </g>
            </g>
        );
    }
}

export default SceneBuilder;
