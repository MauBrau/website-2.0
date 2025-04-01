import React, { useEffect, useState } from "react";
import "./CatWindow.css";
import SceneBuilder from "./SceneBuilder";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Weather } from "../../interface/IWeather";

export default function CatWindow() {
    const [weatherRetrieved, setWeatherRetrieved] = useState<Boolean>(false);
    const [weatherInfo, setWeatherInfo] = useState<Weather>();
    useEffect(() => {
        const getWeather = async () => await axios.get<Weather>("/api/weather");
        if (weatherInfo === undefined) {
            getWeather()
                .then((response: AxiosResponse) => {
                    setWeatherInfo(response.data);
                })
                .catch((error: AxiosError) => {
                    setWeatherRetrieved(true);
                })
                .finally(() => setWeatherRetrieved(true));
        }
    }, [weatherInfo]);

    if (!weatherRetrieved) {
        return <div />;
    }
    return (
        <SceneBuilder
            weatherInfo={weatherInfo}
        />
    );
}
