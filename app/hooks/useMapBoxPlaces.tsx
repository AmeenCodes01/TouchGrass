import { useState } from "react";

// interface Place {
//   id: string;
//   name: string;
//   [key: string]: any; // allow extra fields from Mapbox response
// }

export function useMapboxPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlacesByCategory = async (category: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/category/${category}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
      );

      if (!res.ok) {
        throw new Error(`Mapbox API error: ${res.statusText}`);
      }

      const data = await res.json();
      setPlaces(data.features || []);
      return data.features || [];
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { places, loading, error, fetchPlacesByCategory };
}
