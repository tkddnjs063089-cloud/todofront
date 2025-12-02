"use client";

import { useState } from "react";
import ReactCalendar from "react-calendar";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Todo } from "@/types/todo";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type CalendarProps = {
  todos: Todo[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
};

export default function Calendar({ todos, selectedDate, onSelectDate }: CalendarProps) {
  const [activeMonth, setActiveMonth] = useState(new Date());

  // 해당 날짜에 투두가 있는지 확인
  const getTodosForDate = (date: Date) => {
    return todos.filter((todo) => {
      if (!todo.date) return false;
      return isSameDay(new Date(todo.date), date);
    });
  };

  // 날짜에 점 표시
  const tileContent = ({ date }: { date: Date }) => {
    const todosForDate = getTodosForDate(date);
    if (todosForDate.length === 0) return null;

    const completedCount = todosForDate.filter((t) => t.completed).length;
    const hasIncomplete = completedCount < todosForDate.length;

    return (
      <div className="flex justify-center gap-0.5 mt-1">
        {todosForDate.slice(0, 3).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${hasIncomplete ? "bg-orange-500" : "bg-green-500"}`}
          />
        ))}
        {todosForDate.length > 3 && <span className="text-[8px] text-stone-400">+{todosForDate.length - 3}</span>}
      </div>
    );
  };

  // 선택된 날짜의 투두 목록
  const selectedDateTodos = selectedDate ? getTodosForDate(selectedDate) : [];

  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-stone-200 dark:border-stone-700 transition-colors">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">캘린더</h2>
      </div>

      {/* 달력 */}
      <div className="calendar-wrapper">
        <ReactCalendar
          value={selectedDate}
          onChange={(value) => onSelectDate(value as Date)}
          onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setActiveMonth(activeStartDate)}
          locale="ko-KR"
          tileContent={tileContent}
          prevLabel={<ChevronLeft className="w-5 h-5" />}
          nextLabel={<ChevronRight className="w-5 h-5" />}
          prev2Label={null}
          next2Label={null}
          formatDay={(_, date) => format(date, "d")}
          formatMonthYear={(_, date) => format(date, "yyyy년 M월", { locale: ko })}
          className="w-full border-none"
        />
      </div>

      {/* 선택된 날짜 정보 */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-stone-700 dark:text-stone-300">
              {format(selectedDate, "M월 d일 (EEEE)", { locale: ko })}
            </h3>
            <button
              onClick={() => onSelectDate(null)}
              className="text-xs text-stone-500 hover:text-orange-500 transition-colors"
            >
              선택 해제
            </button>
          </div>

          {selectedDateTodos.length > 0 ? (
            <ul className="space-y-2">
              {selectedDateTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-2 rounded-lg text-sm ${
                    todo.completed
                      ? "bg-green-50 dark:bg-green-900/20 text-stone-500 line-through"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                  }`}
                >
                  {todo.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">이 날짜에 할 일이 없습니다</p>
          )}
        </div>
      )}

      {/* 전체 요약 */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-500">이번 달 할 일</span>
          <span className="text-orange-500 font-bold">
            {todos.filter((t) => t.date && new Date(t.date).getMonth() === activeMonth.getMonth()).length}개
          </span>
        </div>
      </div>
    </div>
  );
}

