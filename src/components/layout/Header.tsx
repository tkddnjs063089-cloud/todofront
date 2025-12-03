"use client";

import { useState, useEffect } from "react";
import { Mountain, Flag, Sparkles, Stars } from "lucide-react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Header() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
          <Mountain className="w-8 h-8" />
          <h1 className="text-2xl font-black tracking-tight">TODO LIST</h1>
          <Flag className="w-6 h-6" />
        </div>
        <p className="text-stone-600 dark:text-stone-300 mt-3 text-sm inline-flex items-center gap-1">
          오늘 할 일을 정리하세요
          {mounted && (theme === "dark" ? <Stars className="w-4 h-4 text-yellow-400" /> : <Sparkles className="w-4 h-4 text-amber-500" />)}
        </p>
        {mounted && <p className="text-2xl font-mono font-bold text-orange-500 dark:text-orange-400 mt-2 tracking-wider">{currentTime}</p>}
      </div>
    </div>
  );
}

