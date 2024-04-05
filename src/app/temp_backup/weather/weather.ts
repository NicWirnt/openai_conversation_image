"use server";

import { protectedAction } from "@/lib/safeAction";
import { z } from "zod";

const CoordinateSchema = z.object({
  coordinate: z.object({
    lat: z.string(),
    lon: z.string(),
  }),
});

export const getHourlyWeather = protectedAction(
  CoordinateSchema,
  async ({ coordinate }) => {
    const { lat, lon } = coordinate;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&cnt=23&units=metric&appi=${process.env.OPEN_WEATHER_API_KEY}`
    );

    const data = await res.json();
    console.log(data);
    return data;
  }
);
