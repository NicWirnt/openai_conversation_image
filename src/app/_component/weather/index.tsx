import {
  getCurrentWeather,
  getHourlyWeather,
} from "@/app/server/actions/weather/weatherAction";
import React, { useEffect, useState } from "react";
import CurrentWeather from "./widgets/CurrentWeather";
type Coordinates = {
  lon: string;
  lat: string;
};
export type Location = {
  city: string;
  coord: Coordinates;
};

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState({});

  const fetchCurrentWeather = async () => {
    try {
      const res = await getCurrentWeather(coordinate);
      if (res) {
        setCurrentWeather(res);
      }
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
          <CurrentWeather data={currentWeather} />
          <div className="col-span-2">5-10 days forecase</div>
        </div>
        <div className="grid grid-cols-4">
          <div>Feels like</div>
          <div>UV Index</div>
          <div>Humidity</div>
          <div>Air Poulution</div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
