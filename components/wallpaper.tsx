"use client";

import { useEffect, useState } from "react";

interface WallpaperProps {
  className?: string;
}

// Get today's wallpaper based on day of year
function getTodaysWallpaper(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // We have wallpapers 1-16 for desktop
  const wallpaperNumber = (dayOfYear % 16) + 1;
  return `${wallpaperNumber}-desktop.png`;
}

function getWallpaperUrl(filename: string): string {
  return `/wallpapers/${filename}`;
}

export function Wallpaper({ className }: WallpaperProps) {
  const [isClient, setIsClient] = useState(false);
  const [wallpaperUrl, setWallpaperUrl] = useState("");

  useEffect(() => {
    setIsClient(true);

    const todaysWallpaper = getTodaysWallpaper();
    setWallpaperUrl(getWallpaperUrl(todaysWallpaper));
  }, []);

  // Don't render with background until client-side
  if (!isClient) {
    return <div className={`fixed inset-0 -z-10 ${className || ""}`} />;
  }

  return (
    <div
      className={`fixed inset-0 -z-10 ${className || ""}`}
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
