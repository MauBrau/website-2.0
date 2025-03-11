export interface Weather {
    statusCode: number;
    result: {
      coord: {
        lon: number;
        lat: number;
      };
      weather: WeatherMain[];
      base: string;
      main: {
        temp: number;
        pressure: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
      };
      visibility: number;
      wind: {
        speed: number;
        deg: number;
        gust: number;
      };
      clouds: {
        all: number;
      };
      dt: number;
      sys: {
        type: number;
        id: number;
        message: number;
        country: string;
        sunrise: number;
        sunset: number;
      };
      id: number;
      name: string;
      cod: string;
    }
  }
  
  export interface WeatherMain {
    id: number;
    main: string;
    description: string;
    icoon: string;
    /*
      Using ID mainly to figure out what to display - https://openweathermap.org/weather-conditions
      If ID is in 2XX, it's thunderstorm, so we set to rain
      if ID is 3XX, it's drizzle, so we set to rain
      If ID is 5XX, it's rain, so we set to rain
      If ID is 6XX, it's snow, so we set to snow
      if ID is 7XX, it's "atmosphere", so we'll just set that to cloudy
      If ID is exactly 800, it's clear, so we set to clear
      If ID is 80x, it's clouds, so:
        801 and 802 is partly cloudy
        803 and 804 is cloudy
  
      It's possible to meet more than one weather condition, however. so how do we prioritize it?
        If there is only one weather condition returned, use that.
        If there is more than one weather condition returned, check in this order:
          if there exists an id of 6XX, set it to snowy (600 range includes light rain and snow)
          if there exists an ID of 2XX, 3XX, or 5XX, set it to rainy
          if there exists an id of 700, set to cloudy
          if id is 803 or 804, set to cloudy
          if there exists an id of 801, 802, set partly cloudy
          otherwise, clear 
    */
  }