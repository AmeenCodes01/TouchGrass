"use client"
import { useEffect, useMemo, useState } from "react";

export default function usePersistState<T>(
  initialValue: T,
  id: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);

  // Load from localStorage after mount (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("state:" + id);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to parse localStorage for:", id, e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Persist whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem("state:" + id, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save to localStorage:", id, e);
    }
  }, [state, id]);

  return [state, setState];
}
