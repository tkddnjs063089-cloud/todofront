"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Bird, Squirrel, Rabbit, Cat, Dog, Rat } from "lucide-react";

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
      {/* 참새 1 - 하늘 왼쪽 */}
      <Bird className="absolute top-20 left-10 w-8 h-8 text-amber-600/40 transform -scale-x-100" />
      {/* 참새 2 - 하늘 오른쪽 */}
      <Bird className="absolute top-28 right-20 w-6 h-6 text-amber-500/35" />
      {/* 다람쥐 1 - 오른쪽 */}
      <Squirrel className="absolute bottom-40 right-8 w-10 h-10 text-amber-700/40" />
      {/* 다람쥐 2 - 왼쪽 */}
      <Squirrel className="absolute bottom-52 left-6 w-8 h-8 text-amber-600/30 transform -scale-x-100" />
      {/* 토끼 - 가운데 아래 */}
      <Rabbit className="absolute bottom-24 left-1/4 w-9 h-9 text-stone-500/35" />
    </>
  );

  // 밤 동물들 (다크 모드) - 부엉이, 육식동물 (고양이, 늑대, 쥐)
  const nightAnimals = (
    <>
      {/* 부엉이 (큰 새) - 위쪽 나무에 앉은 느낌 */}
      <Rat className="absolute bottom-16 right-12 w-12 h-12 text-amber-300/25 transform rotate-6" />
      {/* 부엉이 2 - 왼쪽 위 */}
      <Rat className="absolute bottom-24 left-20 w-10 h-10 text-yellow-400/20" />
      {/* 고양이 - 오른쪽 아래 */}
      <Cat className="absolute bottom-28 right-10 w-11 h-11 text-slate-300/25" />
      {/* 늑대/개 - 왼쪽 아래 */}
      <Dog className="absolute bottom-36 left-12 w-10 h-10 text-slate-400/20 transform -scale-x-100" />
      {/* 쥐 - 구석 */}
      <Rat className="absolute bottom-20 right-1/4 w-7 h-7 text-slate-500/20" />
    </>
  );

  return <div className="fixed inset-0 overflow-hidden pointer-events-none">{theme === "dark" ? nightAnimals : morningAnimals}</div>;
}
