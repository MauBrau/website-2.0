import React, { useEffect, useState } from "react";
import "./CatWindow.css";
import SceneBuilder from "./SceneBuilder";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Weather } from "../../interface/IWeather";

export default function CatWindow() {
    //var weatherInfo : Weather = getWeather();
    const [weatherInfo, setWeatherInfo] = useState<Weather>();
    useEffect(() => {
        const getWeather = async () => (
            await axios.get<Weather>("/api/weather")
        );
        if (weatherInfo === undefined) {
            console.log('weatherinfo: ' + weatherInfo);
            getWeather()
            .then((response: AxiosResponse) => {
                setWeatherInfo(response.data);
                console.log('response?');
                console.log(response.data);
            })
            .catch((error: AxiosError) => console.log("error get"));
        }
        
    }, [weatherInfo]);

    if (!weatherInfo) {
        return <div/>
    }
    return (
        <div className="cat-window">
            <SceneBuilder weatherInfo={weatherInfo} />
            <div className="windowFrame">
                <img
                    alt="Window frame of the cat window"
                    src={require("../../data/images/windowframe-black-notail.png")}
                />
            </div>
        </div>
    );
}
