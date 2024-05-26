"use client";
import { useEffect, useState } from "react";

/**
 * Custom hook to debounce a value after a specified delay
 * @param value - The input value to debounce
 * @param delay - Time in milliseconds to wait before updating the debounced value
 */
export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
