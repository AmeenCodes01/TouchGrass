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

  

  return { places, loading, error,  };
}
