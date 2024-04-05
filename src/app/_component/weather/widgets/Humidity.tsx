import { OpenWeatherData } from "@/app/types";
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

const Humidity = ({ data }: CurrentWeatherProps) => {
  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <div className="div-inside">
      <Card className="pt-1flex flex-col justify-between h-full">
        <CardContent className="p-2">
          <div className="flex flex-col ">
            <div className="flex flex-row justify-between">
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-black dark:fill-white"
                >
                  <path d="M16.59 7.41L6.30996 17.69C5.82996 18.17 5.00996 18.06 4.71996 17.45C4.19996 16.38 3.89996 15.17 3.89996 13.9C3.87996 8.38 9.47996 3.66 11.38 2.21C11.75 1.93 12.25 1.93 12.61 2.21C13.48 2.87 15.11 4.24 16.64 6.04C16.98 6.44 16.96 7.04 16.59 7.41Z" />
                  <path
                    opacity="0.4"
                    d="M20.1 13.9098C20.1 18.3698 16.47 21.9998 12 21.9998C10.21 21.9998 8.53996 21.4198 7.18996 20.4198C6.69996 20.0598 6.65996 19.3398 7.08996 18.9098L17.16 8.83977C17.63 8.36977 18.42 8.46978 18.74 9.04978C19.56 10.5598 20.11 12.1998 20.1 13.9098Z"
                  />
                </svg>
              </i>
              <p className="font-bold text-sm">Humidity</p>
            </div>

            <p className="font-bold">{data.main.humidity} &deg;</p>
            <div>
              <p className="text-xs">
                {data.main.humidity < 40
                  ? "Low humidity. It might feel dry."
                  : data.main.humidity < 70
                  ? "Moderate humidity. Comfortable conditions."
                  : "High humidity. It might feel humid and uncomfortable."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Humidity;
