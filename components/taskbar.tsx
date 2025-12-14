"use client";

import Image from "next/image";
import { UniverseSelector } from "@/features/universe-selection/components/universe-selector.component";

interface TaskbarProps {
  className?: string;
}

export function Taskbar({ className }: TaskbarProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 h-10 bg-background/90 backdrop-blur-md border-b border-border flex items-center justify-between px-2 sm:px-4 shadow-sm z-50 ${className || ""}`}
    >
      {/* Left Section - Empty for now */}
      <div className="flex items-center"></div>

      {/* Center Section - Logo */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden bg-muted/30 hover:bg-black/10 transition-colors duration-200 cursor-pointer">
          <Image
            src="/logo/cofe.png"
            alt="JDR Coffee"
            width={24}
            height={24}
            className="w-full h-full object-contain"
            style={{ imageRendering: "pixelated" }}
            priority
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <UniverseSelector />
      </div>
    </header>
  );
}
