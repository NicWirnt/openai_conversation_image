import {
  HourlyForecastData,
  HourlyForecastResponse,
  OpenWeatherData,
} from "@/app/types";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CurrentWeatherProps = {
  data: OpenWeatherData;
};

const FeelsLike = ({ data }: CurrentWeatherProps) => {
  if (!data) {
    return <div>Loading</div>;
  }

  const kelvinToCelcius = (kelvin: number) => {
    return Math.round(kelvin - 273.15);
  };

  const temp = kelvinToCelcius(data.main.feels_like);
  return (
    <div>
      <Card className="flex flex-col justify-between h-full ">
        <CardContent className="p-2">
          <div className="flex flex-col ">
            <div className="flex flex-row justify-between">
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                </svg>
              </i>
              <p className="font-bold text-sm">Feels like</p>
            </div>

            <p className="font-bold">{temp} &deg;</p>
            <div>
              <p className="text-xs">
                {data.main.feels_like < data.main.temp
                  ? "Feels colder than the actual temperature."
                  : data.main.feels_like > data.main.temp
                  ? "Feels warmer than the actual temperature."
                  : "Feels like the actual temperature."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeelsLike;
