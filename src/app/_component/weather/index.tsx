import {
  getAirPollution,
  getCurrentWeather,
  getDailyForecast,
  getUvIndex,
} from "@/app/server/actions/weather/weatherAction";
import React, { useEffect, useState } from "react";
import CurrentWeather from "./widgets/CurrentWeather";
import {
  AirQualityData,
  HourlyForecastData,
  HourlyForecastResponse,
  OpenWeatherData,
  UVIndexResponse,
} from "@/app/types";
import FeelsLike from "./widgets/FeelsLike";
import UvIndex from "./widgets/UvIndex";
import Humidity from "./widgets/Humidity";
import AirPollution from "./widgets/AirPollution";
import DailyForecast from "./widgets/DailyForecast";
type Coordinates = {
  lon: string;
  lat: string;
};
export type Location = {
  city: string;
  coord: Coordinates;
};

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState<OpenWeatherData>();
  const [airQuality, setAirQuality] = useState<AirQualityData>();
  const [uvIndex, setUvIndex] = useState<UVIndexResponse>();
  const [dailyForecast, setDailyForecast] = useState();

  const fetchCurrentWeather = async () => {
    try {
      const currentWeatherReq = await getCurrentWeather(coordinate);
      const airPollutionReq = await getAirPollution(coordinate);
      const uvIndexReq = await getUvIndex(coordinate);
      const dailyForecastReq = await getDailyForecast(coordinate);

      setDailyForecast(dailyForecastReq);
      setCurrentWeather(currentWeatherReq);

      setUvIndex(uvIndexReq);
      setAirQuality(airPollutionReq);
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    fetchCurrentWeather();
  }, []);

  const defaultLocation: Location = {
    city: "Sydney",
    coord: {
      lat: "-33.8688",
      lon: "151.2093",
    },
  };

  const coordinate = defaultLocation.coord;

  return (
    <div className="weather-section w-[90vh]">
      <div className="weather-block w-full flex flex-col">
        {/* <CurrentWeather data={data} city={data.name} /> */}
        <div className="grid grid-cols-3">
          <CurrentWeather data={currentWeather!} />
          <div className="col-span-2">
            <DailyForecast data={dailyForecast} />
          </div>
        </div>
        <div className="grid grid-cols-4 min-h-[15vh]">
          <FeelsLike data={currentWeather!} />
          <UvIndex data={uvIndex!} />
          <Humidity data={currentWeather!} />
          <AirPollution data={airQuality!} />
        </div>
      </div>
    </div>
  );
};

export default Weather;
