"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Add event listeners for router events
    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  // Reset loading state when the route changes
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50">
          <div className="h-full bg-blue-600 animate-loading-bar"></div>
        </div>
      )}
    </>
  );
}
