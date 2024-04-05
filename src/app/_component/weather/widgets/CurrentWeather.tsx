import { OpenWeatherData } from "@/app/types";
import { kelvinToCelcius } from "@/app/utils/helper";
import React, { useEffect, useState } from "react";
import IconComponent from "../ui/icon-component";

type CurrentWeatherProps = {
  data: OpenWeatherData | undefined;
};

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  console.log("data", data);

  //State
  const [localTime, setLocalTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [weatherMain, setWeatherMain] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [id, setId] = useState<number>();
  useEffect(() => {
    if (weather) {
      setWeatherMain(weather[0].main);
      setDescription(weather[0].description);
      setId(weather[0].id);
    }
  }, [data]);

  if (!data) {
    return <div>Loading</div>;
  }

  const { main, timezone, name, weather } = data;
  const temp = kelvinToCelcius(main?.temp);
  const minTemp = kelvinToCelcius(main?.temp_min);
  const maxTemp = kelvinToCelcius(main?.temp_max);
  return (
    <div className="py-1 border rounded-lg flex flex-col justify-between">
      <p className="flex justify-between items-center">
        <span className="font-medium">{currentDay}</span>
        <span className="font-medium">{localTime}</span>
      </p>
      <p className="pt-5 font-bold flex gap-1">
        <span>{name}</span>
        <span className="font-medium">
          <i className="fa-solid fa-location-arrow">i</i>
        </span>
      </p>
      <p className="py-5 text-6xl font-bold text-center">{temp}°</p>
      <div>
        <div>
          <span>
            <IconComponent weatherCode={id} className="h-8 w-8" />
            <p className="pt-1 capitalize text-sm font-bold">{description}</p>
          </span>
        </div>
        <p>
          <span>Low: {minTemp}° </span>
          <span>High: {maxTemp}°</span>
        </p>
      </div>
    </div>
  );
};

export default CurrentWeather;
