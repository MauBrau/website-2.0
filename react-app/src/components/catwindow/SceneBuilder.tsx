import React, { useEffect, useState } from "react";
import "./CatWindow.css";
import { Weather, WeatherMain } from "../../interface/IWeather";
import {
    DAY_RAIN_SKY,
    DAY_SKY,
    DEFAULT_SUN,
    DEFAULT_TRUNK,
    LIGHT_GRAY,
    NIGHT_RAIN_SKY,
    NIGHT_SKY,
    SUNSET_SKY,
    WHITE,
    WINDOW_FRAME,
} from "../helper/Style";
import { DateTime } from "luxon";

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

const WINDOWSIZE = 500;
const SCENESIZE = 354; // roughly
const matrixScale = SCENESIZE/WINDOWSIZE;
function SceneBuilder({ weatherInfo }: SceneProps) {
    const fixed = weatherInfo === undefined;
    const currentTime: DateTime = DateTime.now().setZone("America/Toronto");
    const currentTimeUnix: number = currentTime.toUnixInteger();

    var scene: SceneValues = createScene();

    if (scene === undefined) {
        return <div />;
    }

    const palette = generatePalette();
    const windowClass = "windowView " + palette.sky;
    const isSnowy = scene.weather === WeatherState.Snowy;
    const isRainy = scene.weather === WeatherState.Rainy;
    const showSunOrMoon = !isSnowy && !isRainy;
    var weatherText = fixed ? "Weather info unavailable" : `Weather in Montreal:  ${Math.round(scene.temp)} °C, ${scene.weather}`;
    
    return (
        <div className={windowClass} style={{ width: WINDOWSIZE, height: WINDOWSIZE }}>
            <svg
                width={`${WINDOWSIZE}px`}
                viewBox={`0 0 ${WINDOWSIZE} ${WINDOWSIZE}`}
                style={{ overflow: "hidden" }}
            >
                <g >
                    {baseScene()}
                    {/* transform={`matrix(${matrixScale}, 0, 0, ${matrixScale}, 0, 0)`} */}
                    {/* {catTail()} */}
                </g>
            </svg>
            <div className="weatherInfo">
                <p>{weatherText}</p>
            </div>
        </div>
    );

    function createScene() {
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

    function baseScene() {
        return (
            <>
                {isSnowy || isRainy ? null : stars()}
                {showSunOrMoon
                    ? scene.time === TimeOfDay.Night
                        ? moon()
                        : sun()
                    : null}
                {clouds()}
                {city()}
                {land()}
                {trees()}
                {isSnowy ? snow() : null}
                {isRainy ? rain() : null}
                {frame()}
                {cat()}
            </>
        );
    }

    function cat() {
        return (
            <g transform="matrix(0.5, 0, 0, 0.5, 0, 0)">
                <path
                    d="M0 0 C6.76199177 -0.49178122 11.02301073 0.93381486 17 4 C17.77472656 4.3815625 18.54945312 4.763125 19.34765625 5.15625 C21.2387667 6.0901317 23.12042021 7.04312301 25 8 C25.474375 6.865625 25.94875 5.73125 26.4375 4.5625 C28 1 28 1 29 0 C35.34207928 0.12943019 39.49171527 2.57462626 44 7 C44.30292969 7.70511719 44.60585937 8.41023437 44.91796875 9.13671875 C45.27503906 9.75160156 45.63210937 10.36648438 46 11 C47.65406261 11.3911084 49.32352029 11.7201703 51 12 C64.76216319 20.90960854 70.42189224 38.58689765 75.09765625 53.45703125 C75.91774842 55.7682001 76.84750574 57.66763756 78.125 59.75 C83.56959971 69.18730617 83.11685403 80.79706826 82.875 91.375 C82.78708227 98.36599628 83.0889958 104.6106391 85.24609375 111.33203125 C87.12810603 117.99220941 87.08459896 124.59046359 86.88671875 131.44140625 C86.85456366 133.26104088 86.82401693 135.0807045 86.79492188 136.90039062 C86.74587785 139.7222523 86.68810756 142.54252711 86.60229492 145.36352539 C86.22922547 158.19328232 87.43087437 167.38461722 93 179 C95.91325067 188.24543634 95.58299652 201.13562297 91.4375 209.8125 C88.35655045 214.97912798 84.49308296 220.25345852 79 223 C77.94258399 225.15037541 77.08378707 227.35320548 76.1953125 229.578125 C73.6335417 234.768641 70.59197769 237.62741987 65.4375 240.1875 C64.48746094 240.67605469 63.53742188 241.16460937 62.55859375 241.66796875 C52.89194685 245.28632945 42.9860709 245.33090978 32.78515625 245.21484375 C25.14860575 245.34228298 20.89375365 247.23755955 15 252 C13.85342267 252.84674673 12.70390684 253.6895365 11.55078125 254.52734375 C11.02025146 254.92356934 10.48972168 255.31979492 9.94311523 255.72802734 C-1.0059554 263.84925746 -12.66190433 269.79094848 -26 273 C-26.70157227 273.17805176 -27.40314453 273.35610352 -28.12597656 273.53955078 C-36.8908268 275.47262049 -45.70509179 275.30231109 -54.6328125 275.26074219 C-57.36220661 275.25005012 -60.09093872 275.26066965 -62.8203125 275.2734375 C-91.22251249 275.29830582 -91.22251249 275.29830582 -99 268 C-108.4414909 256.47653931 -107.02065082 241.03813171 -106 227 C-103.854387 211.24383182 -97.33173032 193.87179453 -84.375 184 C-81.70939287 182.8776391 -79.86430217 182.6817442 -77 183 C-76 184 -76 184 -75.73828125 187.16015625 C-76.03115434 191.45708533 -77.08779932 193.70818089 -79.1875 197.4375 C-86.05530759 210.34128912 -91.55754917 225.88721083 -87.9375 240.5625 C-86.01885397 245.81081425 -83.12017531 248.32774918 -78.20703125 250.9609375 C-67.85761986 255.32490594 -54.50888106 253.99801011 -44.18359375 250.32421875 C-33.8359359 246.02010095 -24.79680527 240.91177557 -16 234 C-16.39832031 233.06800781 -16.79664062 232.13601562 -17.20703125 231.17578125 C-30.55296666 199.35668216 -26.39510547 167.36218169 -14.16455078 135.82910156 C-9.12559848 123.58772226 -3.45169658 111.36819312 3.87792969 100.32543945 C5.64419058 96.66494446 5.24321203 93.28619426 5.015625 89.30859375 C4.98500559 82.82493289 6.104942 74.790116 9 69 C8.443125 68.9175 7.88625 68.835 7.3125 68.75 C2.83828188 67.29890223 -0.66533111 64.02414439 -3 60 C-3.29860561 57.23643434 -3.4276154 54.75668177 -3.375 52 C-3.36557373 51.24396484 -3.35614746 50.48792969 -3.34643555 49.70898438 C-3.05600972 38.79545286 -0.35974633 29.03072607 6.328125 20.2578125 C7.44486135 16.50505895 5.62186125 13.33853322 4.1875 9.875 C3.75727539 8.78251953 3.75727539 8.78251953 3.31835938 7.66796875 C2.28878335 5.07122922 1.2497974 2.49959479 0 0 Z "
                    fill="#352E34"
                    transform="translate(106,0)" // Move him
                />
            </g>
        );
        // TODO - tail movement
        // return (
        //     // style="fill: rgb(140, 161, 1); transform-origin: 186.672px 283.553px;"
        //     <g id='tail'>
        //         <path id="tail-1" fill="black"  d="M 277.531 298.845 L 286.408 309.297 L 289.664 314.681 L 292.119 325.468 L 292.119 330.161 L 289.664 339.267 L 283.952 347.69 L 271.82 357.42 L 260.503 363.512 L 258.862 363.81 L 258.056 364.49 L 251.535 366.86 L 253.152 364.49 L 254.784 360.133 L 253.959 357.755 L 253.152 352.051 L 249.903 346.333 L 238.563 333.851 L 234.484 330.848 L 215.032 319.374 L 189.103 308.292 L 153.415 296.52 L 123.424 283.068 L 107.218 272.615 L 94.986 261.493 L 84.496 246.033 L 81.225 230.885 L 82.029 223.137 L 86.919 211.677 L 95.812 200.247 L 102.314 217.392 L 109.577 226.487 L 122.614 234.911 L 138.019 242.309 L 245.922 279.34 L 263.752 288.783 L 277.531 298.845 Z" />
        //         {/* <path id="tail-1" fill="#ffffff" d="M8054 2883s96 377-501 688-129 433 106 284 735-703 551-997-142-10-142-10z" />
        //         <path id="tail-2" fill="#ffffff" d="M8054 2883s35 472-262 940 213 397 314 134 288-805 104-1099-142-10-142-10z" />
        //         <path id="tail-3" fill="#ffffff" d="M8385 2927s215 714 309 958-141 335-270 90-161-629-184-975 112-92 112-92z" />
        //         <path id="tail-4" fill="#ffffff" d="M8385 2927s251 402 775 603 60 447-181 295-716-479-739-825 112-92 112-92z" /> */}
        //     </g>
        // )
    }

    function frame() {
        return (
            <g id="window-frame">
                <rect
                    width={`${WINDOWSIZE - 16}`}
                    height={`${WINDOWSIZE - 16}`}
                    stroke="white"
                    strokeWidth={16}
                    fillOpacity={0}
                    strokeOpacity={1}
                    x={8}
                    y={8}
                />
            </g>
        );
    }

    function trees() {
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

    function land() {
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
        return (
            <g id="land">
                <path
                    id="land-far"
                    fill={farHill}
                    d={`M 0.741 272.444 C 103.909 235.368 375.944 240.152 ${WINDOWSIZE} 240.152 L ${WINDOWSIZE} 306.428 L 0.741 306.024 L 0.741 272.444 Z`}
                />
                <path
                    id="land-mid"
                    fill={midHill}
                    d={`M 0.741 298.57 C 103.909 335.646 375.944 330.862 363.869 330.862 L ${WINDOWSIZE} 264.586 L 0.741 264.99 L 0.741 298.57 Z`}
                    transform="matrix(-1, 0, 0, -1, 364.999364, 595.649292)"
                />
                <path
                    id="land-close"
                    fill={closeHill}
                    d={`M 1.59 318.026 C 104.276 266.778 375.041 281.673 ${WINDOWSIZE} 281.673 L ${WINDOWSIZE} ${WINDOWSIZE} L 1.59 ${WINDOWSIZE} L 1.59 318.026 Z`}
                />
            </g>
        );
    }

    function city() {
        var buildingColour = palette.building;
        var windowColour = palette.window;
        var windowBorder = palette.windowFrame;
        // TODO: lots of duplicating, maybe we generate window/building positions in a loop eventually?
        return (
            <g id="city">
                {/* 6 buildings */}
                <rect
                    id="city-building-1"
                    x="295.249"
                    y="126.696"
                    width="90"
                    height="151"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-2"
                    x="88.235"
                    y="127.262"
                    width="41.29"
                    height="141.403"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-3"
                    x="196.833"
                    y="154.412"
                    width="45.249"
                    height="113.688"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-4"
                    x="1.131"
                    y="110.294"
                    width="96.72"
                    height="173.077"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-5"
                    x="234.728"
                    y="109.163"
                    width="67.873"
                    height="160.068"
                    fill={buildingColour}
                />
                <rect
                    id="city-building-6"
                    x="123.869"
                    y="92.76"
                    width="83.145"
                    height="174.774"
                    fill={buildingColour}
                />

                {/* Multiple windows */}
                <rect
                    id="city-window-1"
                    x="19.796"
                    y="138.009"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-2"
                    x="53.733"
                    y="158.654"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-3"
                    x="148.19"
                    y="125.283"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-4"
                    x="213.235"
                    y="184.106"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-5"
                    x="146.493"
                    y="196.55"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-6"
                    x="260.746"
                    y="135.464"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                {/* <rect x="313.348" y="87.387" width="13.575" height="13.009" fill={windowColour} stroke={windowBorder} /> */}
                <rect
                    id="city-window-7"
                    x="263.009"
                    y="205.034"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-8"
                    x="101.81"
                    y="153.563"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-9"
                    x="178.167"
                    y="217.477"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-10"
                    x="24.887"
                    y="207.296"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-11"
                    x="284.502"
                    y="160.916"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-12"
                    x="350"
                    y="180"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-13"
                    x="370"
                    y="150"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
                <rect
                    id="city-window-14"
                    x="315"
                    y="190"
                    width="13.575"
                    height="13.009"
                    fill={windowColour}
                    stroke={windowBorder}
                />
            </g>
        );
    }

    function sun() {
        var colour = palette.sun;
        var cx = "182.5";
        var cy = "46.095";
        if (scene.time === TimeOfDay.Sunset) {
            cx = "27.523";
            cy = "105.484";
        } else if (scene.time === TimeOfDay.Sunrise) {
            cx = "334.084";
            cy = "117.927";
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

    function moon() {
        return (
            <g id="moon">
                <path
                    fill={WHITE}
                    d="M 197.444 35.317 C 188.55 24.211 170.968 26.895 165.795 40.151 C 160.623 53.406 171.739 67.29 185.805 65.143 C 190.39 64.443 194.544 62.044 197.444 58.423 C 188.55 64.321 176.607 58.382 175.944 47.731 C 175.283 37.08 186.398 29.706 195.954 34.458 C 196.468 34.714 196.965 35.001 197.444 35.317 Z"
                    transform="matrix(0.891006, -0.453991, 0.453991, 0.891006, -1.554919, 87.269449)"
                />
            </g>
        );
    }
    function clouds() {
        var cloud = palette.cloud;

        if (scene.weather === WeatherState.Clear) {
            return <g />;
        }
        var showAllClouds = scene.weather !== WeatherState.PartlyCloudy;
        return (
            <g>
                {/* 7 on rainy/snow/cloudy day, 4 on partly cloudy */}
                {/* Furthest to the right */}
                <path
                    id="cloud-1"
                    className="cloud c1"
                    fill={cloud}
                    d="M 397.286 45.861 C 401.69 45.861 405.299 48.49 405.299 51.699 C 405.299 54.907 401.692 57.536 397.286 57.536 L 362.946 57.536 L 361.802 57.536 C 355.483 57.536 350.358 53.802 350.358 49.197 C 350.358 44.592 356.507 43.989 362.829 43.989 C 363.358 43.857 371.942 32.975 380.116 34.187 C 388.181 35.383 396.145 37.211 396.145 45.861 L 397.286 45.861 Z"
                    transform="matrix(1, 0, 0, 1, -50, 0)"
                />
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
                { showAllClouds && <>
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
                </>}
                
            </g>
        );
    }

    function stars() {
        if (scene.time === TimeOfDay.Night) {
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
    }

    function snow() {
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

    function rain() {
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
