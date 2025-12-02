"use client";

import { Mountain, Flag, Sparkles, Stars } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setMounted(true);

    // 현재 시간 업데이트
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime(); // 초기 시간 설정
    const interval = setInterval(updateTime, 1000); // 1초마다 업데이트

    return () => clearInterval(interval); // 클린업
  }, []);

  return (
    <div className="text-center mb-8">
      {/* 테마 토글 - 우측 상단 */}
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
        {/* 현재 시간 */}
        {mounted && <p className="text-2xl font-mono font-bold text-orange-500 dark:text-orange-400 mt-2 tracking-wider">{currentTime}</p>}
      </div>
    </div>
  );
}
