"use client"
import { useState } from "react";

export default function useGetCoord() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    console.log("running")
   window.navigator.geolocation.getCurrentPosition(
    async  (position) => {
        console.log(position," position")
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  };

  return { coords, error, getLocation };
}

// Usage in a component
/*
const { coords, error, getLocation } = useGeolocation();
<Button onClick={getLocation}>Get My Location</Button>
{coords && <p>Lat: {coords.lat}, Lng: {coords.lng}</p>}
{error && <p>{error}</p>}
*/
