import { ForecastData, TenDayForecastData } from "@/app/types";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import moment from "moment";
import IconComponent from "../ui/icon-component";
import { TemperatureRange } from "../ui/temperature-range";
type DailyForecastProps = {
  data: TenDayForecastData;
};

const DailyForecast = ({ data }: DailyForecastProps) => {
  const kelvinToCelsius = (kelvin: number) => {
    return Math.round(kelvin - 273.15);
  };
  const unixToDay = (unix: number) => {
    return moment.unix(unix).format("ddd");
  };

  const processData = (dailyData: any) => {
    let minTemp = Number.MAX_VALUE;
    let maxTemp = Number.MIN_VALUE;

    dailyData.forEach(
      (day: { main: { temp_min: number; temp_max: number }; dt: number }) => {
        if (day.main.temp_min < minTemp) {
          minTemp = day.main.temp_min;
        }
        if (day.main.temp_max > maxTemp) {
          maxTemp = day.main.temp_max;
        }
      }
    );

    return {
      day: unixToDay(dailyData[0].dt),
      minTemp: kelvinToCelsius(minTemp),
      maxTemp: kelvinToCelsius(maxTemp),
    };
  };

  if (!data) {
    return <div>Loading</div>;
  }

  const temperatures = data.list.map((list: ForecastData) => list.main!.temp);
  const minTemperature = kelvinToCelsius(
    Math.min(...temperatures.map((temp) => temp))
  );
  const maxTemperature = kelvinToCelsius(
    Math.max(...temperatures.map((temp) => temp))
  );
  console.log(minTemperature, maxTemperature);
  console.log(data);
  const convertToDate = (
    timezone: number,
    dt: number,
    weekdayFormat: "short" | "long"
  ): string => {
    let utc_time = new Date(dt * 1000);
    let local_time = new Date(utc_time.getTime() + timezone * 1000);

    const options = { weekday: weekdayFormat };
    const dateFormatter = new Intl.DateTimeFormat("UTC", options);

    return dateFormatter.format(local_time);
  };

  const { city, list } = data;

  const dailyForecasts = [];
  for (let i = 0; i < 40; i += 8) {
    const dailyData = list.slice(i, i + 5);
    dailyForecasts.push(processData(dailyData));
  }

  return (
    <Card className="w-full h-full">
      <CardContent className="p-2 h-full">
        <div className="h-full">
          <div className="flex flex-row gap-6 items-center font-bold text-sm">
            <i>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 invert dark:invert-0"
              >
                <path
                  d="M8 2V5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 2V5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 9.08984H20.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.6947 13.7002H15.7037"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.6947 16.7002H15.7037"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9955 13.7002H12.0045"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9955 16.7002H12.0045"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.29431 13.7002H8.30329"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.29431 16.7002H8.30329"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </i>
            <p>5-Days Forecast</p>
          </div>
          <div className="flex flex-row justify-between h-full">
            {dailyForecasts.map((day, i) => {
              return (
                <div key={i} className="h-full flex flex-col">
                  <p className="text-xl">{day.day}</p>

                  <div className="flex justify-between flex-col h-[150px] w-[60px]">
                    <p className="font-bold">{day.maxTemp}°C</p>
                    <TemperatureRange
                      min={minTemperature}
                      max={maxTemperature}
                      value={[day.minTemp, day.maxTemp]}
                    />
                    <p className="font-bold">{day.minTemp}°C</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyForecast;
