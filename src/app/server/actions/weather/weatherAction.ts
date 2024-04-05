"use server";

type CoordinateProps = {
  lat: string;
  lon: string;
};

export async function getCurrentWeather(coordinate: CoordinateProps) {
  const { lat, lon } = coordinate;

  if (!lat || !lon) {
    return Response.json({ message: "Missing Parameters" });
  }
  console.log(coordinate);
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await res.json();

  return data;
}
