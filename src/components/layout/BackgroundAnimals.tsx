"use client";

import { useEffect, useState } from "react";
import { Bird, Cat, Squirrel, Rabbit } from "lucide-react";
import { useTheme } from "next-themes";

export default function BackgroundAnimals() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 아침 동물들 (라이트 모드) - 참새, 다람쥐, 토끼
  const morningAnimals = (
    <>
      {/* 참새들 */}
      <Bird className="absolute top-20 left-10 w-8 h-8 text-amber-600/30 transform -scale-x-100" />
      <Bird className="absolute top-32 left-32 w-6 h-6 text-amber-500/25" />
      {/* 다람쥐들 */}
      <Squirrel className="absolute bottom-40 right-8 w-10 h-10 text-amber-700/30" />
      <Squirrel className="absolute bottom-28 left-20 w-8 h-8 text-amber-600/25 transform -scale-x-100" />
      {/* 토끼 */}
      <Rabbit className="absolute bottom-24 left-12 w-9 h-9 text-stone-500/25" />
    </>
  );

  // 밤 동물들 (다크 모드) - 부엉이(Bird로 대체), 고양이, 늑대(Cat으로 대체), 쥐(Squirrel로 대체)
  const nightAnimals = (
    <>
      {/* 부엉이 (Bird 아이콘으로 대체) */}
      <Bird className="absolute top-16 right-16 w-10 h-10 text-slate-300/20 transform rotate-12" />
      <Bird className="absolute top-40 left-8 w-7 h-7 text-slate-300/15 transform -scale-x-100" />
      {/* 고양이 */}
      <Cat className="absolute bottom-32 right-10 w-10 h-10 text-slate-400/20" />
      {/* 늑대/개 (Cat 아이콘으로 대체) */}
      <Cat className="absolute bottom-20 left-16 w-8 h-8 text-slate-400/15" />
      {/* 쥐 (Squirrel 아이콘으로 대체) */}
      <Squirrel className="absolute bottom-48 left-6 w-8 h-8 text-slate-300/20 transform -scale-x-100" />
    </>
  );

  return <div className="fixed inset-0 overflow-hidden pointer-events-none">{theme === "dark" ? nightAnimals : morningAnimals}</div>;
}

