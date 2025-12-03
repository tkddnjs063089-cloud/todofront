"use client";

import { Mountain } from "lucide-react";
import BackgroundAnimals from "./BackgroundAnimals";

export default function Background() {
  return (
    <>
      {/* 산 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 dark:opacity-10">
        <Mountain className="absolute bottom-0 left-0 w-96 h-96 text-stone-500 dark:text-white" />
        <Mountain className="absolute bottom-0 right-10 w-64 h-64 text-stone-500 dark:text-white" />
      </div>

      {/* 동물 배경 */}
      <BackgroundAnimals />
    </>
  );
}

