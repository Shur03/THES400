"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
      setProgress(0);

      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);

      // Simulate progress
      const id = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(id);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      setTimeoutId(id);
    };

    const handleRouteChangeComplete = () => {
      if (timeoutId) clearTimeout(timeoutId);
      setProgress(100);

      // Reset after animation completes
      const id = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 500);

      setTimeoutId(id);
    };

    // Add event listeners for router events
    window.addEventListener("beforeunload", handleRouteChangeStart);
    window.addEventListener("load", handleRouteChangeComplete);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      window.removeEventListener("load", handleRouteChangeComplete);
    };
  }, [timeoutId]);

  // Reset when the route changes
  useEffect(() => {
    setIsNavigating(false);
    setProgress(0);
  }, [pathname, searchParams]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200">
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
