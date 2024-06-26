import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UVIndexResponse } from "@/app/types";
import { Progress } from "@/components/ui/progress";

type UvIndexProp = {
  data: UVIndexResponse;
};

const UvIndex = ({ data }: UvIndexProp) => {
  if (!data) {
    return <div>Loading</div>;
  }
  const uvIndexForToday = data.daily.uv_index_max[0];

  return (
    <div>
      <Card className="order-5 flex flex-col justify-between h-full">
        <CardContent className="p-2">
          <div>
            <div className=" flex flex-row justify-between">
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 stroke-black dark:stroke-white"
                >
                  <path
                    d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
              <p className="text-sm font-bold">UV Index</p>
            </div>

            <p className="mb-2 text-sm font-bold">
              {Math.round(uvIndexForToday)} {" | "}
              {uvIndexForToday <= 2
                ? "Low"
                : uvIndexForToday <= 5
                ? "Moderate"
                : uvIndexForToday <= 7
                ? "High"
                : "Very High"}
            </p>
            <Progress aria-label="UV Index" value={uvIndexForToday * 10} />
            <p className="text-xs">
              {uvIndexForToday <= 2
                ? "No protection needed."
                : uvIndexForToday <= 5
                ? "Wear sunscreen."
                : "Take precautions."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UvIndex;
