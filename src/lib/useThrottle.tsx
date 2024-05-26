// hooks/useThrottle.ts
import { useEffect, useState, useRef } from "react";

/**
 * Custom hook to throttle a value update to a specified interval with a maximum number of requests
 * @param value - The input value to throttle
 * @param delay - The time interval in milliseconds for throttling value changes
 * @param maxRequests - The maximum number of requests allowed within the interval
 * @param interval - The interval in milliseconds within which the requests are counted
 */
export const useThrottle = (
  value: string,
  delay: number,
  maxRequests: number,
  interval: number,
): string => {
  const [throttledValue, setThrottledValue] = useState(value);
  const requestCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset request count after each interval
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        requestCountRef.current = 0;
      }, interval);
    }

    // Update throttled value if request count is within limit
    if (requestCountRef.current < maxRequests) {
      const handler = setTimeout(() => {
        setThrottledValue(value);
        requestCountRef.current += 1;
      }, delay);

      // Clear timeout if the value changes or when the component unmounts
      return () => clearTimeout(handler);
    }

    // Cleanup interval timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay, maxRequests, interval]);

  return throttledValue;
};
