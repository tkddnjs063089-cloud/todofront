"use client";

import { useTodos } from "@/hooks/useTodos";
import { Header, Footer, Background } from "@/components/layout";
import { TodoPanel } from "@/components/todo";
import { WeekView } from "@/components/calendar";

export default function Home() {
  const { todoPanelProps, weekViewProps } = useTodos();

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-stone-100 to-orange-100 dark:from-slate-800 dark:via-stone-700 dark:to-amber-900 py-10 px-4 transition-colors">
      <Background />

      <div className="max-w-6xl mx-auto relative mb-8">
        <Header />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodoPanel {...todoPanelProps} />
          <WeekView {...weekViewProps} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
