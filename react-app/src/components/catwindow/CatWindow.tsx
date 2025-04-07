import React, { useEffect, useState } from "react";
import "./CatWindow.css";
import SceneBuilder from "./SceneBuilder";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Weather } from "../../interface/IWeather";

export default function CatWindow() {
    const [weatherRetrieved, setWeatherRetrieved] = useState<Boolean>(false);
    const [weatherInfo, setWeatherInfo] = useState<Weather>();

    useEffect(() => {
        axios.get<Weather>("/api/weather").then((response: AxiosResponse) => {
            setWeatherInfo(response.data);
        })
        .catch((error: AxiosError) => { 
            // Leaving it as undefined will make it fall back to static style 
        })
        .finally(() => setWeatherRetrieved(true));
    }, []);

    if (!weatherRetrieved) {
        return <div />;
    }
    return <SceneBuilder weatherInfo={weatherInfo} />;
}
