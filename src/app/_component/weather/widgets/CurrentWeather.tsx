import { OpenWeatherData } from "@/app/types";
import { kelvinToCelcius } from "@/app/utils/helper";
import React, { useEffect, useState } from "react";
import IconComponent from "../ui/icon-component";
import moment from "moment";
type CurrentWeatherProps = {
  data: OpenWeatherData;
};

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  //State
  const [localTime, setLocalTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [weatherMain, setWeatherMain] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [id, setId] = useState<number>();

  useEffect(() => {
    if (data) {
      const { weather } = data;
      const { description, id } = weather[0];
      setWeatherMain(weather[0].main);
      setDescription(description);
      setId(id);
      ``;
      //liveTime
      const localMoment = moment().utcOffset(data.timezone / 60);
      //custom format: 24 hour format
      const formatedTime = localMoment.format("HH:mm:ss");
      //day of the week
      const day = localMoment.format("dddd");
      setLocalTime(formatedTime);
      setCurrentDay(day);
    }
  }, [data]);

  const kelvinToCelcius = (kelvin: number) => {
    return Math.round(kelvin - 273.15);
  };
  // const { main, timezone, name, weather } = data;

  const temp = kelvinToCelcius(data?.main.temp);
  const minTemp = kelvinToCelcius(data?.main.temp_min);
  const maxTemp = kelvinToCelcius(data?.main.temp_max);
  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <div className="pt-4 pb-2 px-2 border rounded-lg flex flex-col justify-between">
      <div className=" font-bold flex justify-between gap-1">
        <p>
          <span>{data.name}</span>
          <span className="font-medium">
            <i className="fa-solid fa-location-arrow">i</i>
          </span>
        </p>
        <p>
          <span className="font-medium">{currentDay}</span>
        </p>
      </div>
      <p className="py-5 text-6xl font-bold text-center">{temp}&deg;</p>
      <div>
        <div>
          <span>
            <IconComponent weatherCode={id} className="h-8 w-8" />
            <p className="pt-1 capitalize text-sm font-bold">{description}</p>
          </span>
        </div>
        <p className="flex items-center gap-2 text-xs">
          <span>Low: {minTemp}&deg;</span>
          <span>High: {maxTemp}&deg;</span>
        </p>
      </div>
    </div>
  );
};

export default CurrentWeather;
