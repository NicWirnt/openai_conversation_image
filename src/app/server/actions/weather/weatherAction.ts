"use server";

type CoordinateProps = {
  lat: string;
  lon: string;
};

const apiKey = process.env.OPEN_WEATHER_API_KEY;

export async function getCurrentWeather(coordinate: CoordinateProps) {
  const { lat, lon } = coordinate;

  if (!lat || !lon) {
    return Response.json({ message: "Missing Parameters" });
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await res.json();
  return data;
}

export async function getAirPollution(coordinate: CoordinateProps) {
  try {
    const { lat, lon } = coordinate;

    if (!lat || !lon) {
      return Response.json({ message: "Missing Parameters" });
    }

    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUvIndex(coordinate: CoordinateProps) {
  try {
    const { lat, lon } = coordinate;

    if (!lat || !lon) {
      return Response.json({ message: "Missing Parameters" });
    }

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1`
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getDailyForecast(coordinate: CoordinateProps) {
  try {
    const { lat, lon } = coordinate;

    if (!lat || !lon) {
      return Response.json({ message: "Missing Parameters" });
    }

    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}
