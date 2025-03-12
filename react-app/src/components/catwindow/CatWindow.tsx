import React from "react";
import "./CatWindow.css";
import SceneBuilder from "./SceneBuilder";
import { Palette } from "./SceneBuilder";

export default function CatWindow() {
    const [palette, setPalette] = React.useState<Palette>();
    var className = 'windowView ' + (palette?.sky ?? 'day');

    // TODO: weather call out
    async function getWeather() {
        try {
            //const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)
            //console.log(response);
            //setWeatherResponse(response);
        } catch(error) {
            console.log('error get');
            console.error(error);
        }
    }
    return (
        <div className="cat-window">
            <div className={className}>
                <svg
                    width="315px"
                    viewBox="0 0 315 315"
                    style={{ overflow: "hidden" }}
                >    
                    <g transform="matrix(0.867628, 0, 0, 0.864012, -0.340668, 0.604332)">
                        {/* <SceneBuilder palette={null} weather="" timeOfDay="" winter={} temp={} /> */}
                    </g>
                </svg>
                <div className="weatherInfo">
                    <p>temp weather info</p>
                </div>
            </div>
            <div className="windowFrame" >
                <img src={require('../../data/images/windowframe-no-cat.png')}/>
            </div>
        </div>
    );
}
