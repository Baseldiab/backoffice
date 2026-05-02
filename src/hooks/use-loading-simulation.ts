import { useState, useEffect } from 'react';

/**
 * Simulates a loading delay so skeletons are visible during review.
 * @param delayMs – duration of the simulated loading state (default 1000ms)
 */
export function useLoadingSimulation(delayMs = 1000) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return isLoading;
}
