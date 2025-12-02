"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isSameDay, isToday, differenceInWeeks, differenceInMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { Todo } from "@/types/todo";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type WeekViewProps = {
  todos: Todo[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
};

const WeekView = memo(function WeekView({ todos, selectedDate, onSelectDate }: WeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));

  // 이번 주 시작일 (메모이제이션)
  const thisWeekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 0 }), []);

  // 주의 날짜들 생성 (일~토) (메모이제이션)
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)), [currentWeekStart]);

  // 주 끝 날짜 (메모이제이션)
  const weekEnd = useMemo(() => endOfWeek(currentWeekStart, { weekStartsOn: 0 }), [currentWeekStart]);

  // 이번 주인지 여부 (메모이제이션)
  const isThisWeek = useMemo(() => differenceInWeeks(currentWeekStart, thisWeekStart) === 0, [currentWeekStart, thisWeekStart]);

  // 현재 보고 있는 주의 레이블 계산 (메모이제이션)
  const weekLabel = useMemo(() => {
    const weekDiff = differenceInWeeks(currentWeekStart, thisWeekStart);
    const monthDiff = differenceInMonths(currentWeekStart, thisWeekStart);

    if (weekDiff === 0) return "이번 주";
    if (weekDiff === -1) return "저번 주";
    if (weekDiff === 1) return "다음 주";

    if (Math.abs(monthDiff) >= 1) {
      if (monthDiff > 0) return `${monthDiff}달 후`;
      return `${Math.abs(monthDiff)}달 전`;
    }

    if (weekDiff > 0) return `${weekDiff}주 후`;
    return `${Math.abs(weekDiff)}주 전`;
  }, [currentWeekStart, thisWeekStart]);

  // 해당 날짜에 투두가 있는지 확인
  const getTodosForDate = useCallback(
    (date: Date) => {
      return todos.filter((todo) => {
        if (!todo.date) return false;
        return isSameDay(new Date(todo.date), date);
      });
    },
    [todos]
  );

  // 이번 주 투두 개수 (메모이제이션)
  const weekTodoCount = useMemo(() => {
    return weekDays.reduce((acc, date) => acc + getTodosForDate(date).length, 0);
  }, [weekDays, getTodosForDate]);

  // 선택된 날짜의 투두 (메모이제이션)
  const selectedDateTodos = useMemo(() => {
    if (!selectedDate) return [];
    return getTodosForDate(selectedDate);
  }, [selectedDate, getTodosForDate]);

  // 이전 주
  const goToPrevWeek = useCallback(() => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  }, []);

  // 다음 주
  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  }, []);

  // 이번 주로 이동
  const goToThisWeek = useCallback(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
  }, []);

  // 날짜 선택 해제
  const clearSelectedDate = useCallback(() => {
    onSelectDate(null);
  }, [onSelectDate]);

  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-stone-200 dark:border-stone-700 transition-colors">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">주간 일정</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isThisWeek ? "text-orange-500" : "text-stone-500 dark:text-stone-400"}`}>{weekLabel}</span>
          {!isThisWeek && (
            <button onClick={goToThisWeek} className="text-xs text-orange-500 hover:text-orange-600 transition-colors px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded cursor-pointer">
              오늘
            </button>
          )}
        </div>
      </div>

      {/* 주 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPrevWeek} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-stone-700 dark:text-stone-300">
          {format(currentWeekStart, "M월 d일", { locale: ko })} - {format(weekEnd, "M월 d일", { locale: ko })}
        </span>
        <button onClick={goToNextWeek} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
          <div key={day} className={`text-center text-xs font-semibold py-1 ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-stone-500 dark:text-stone-400"}`}>
            {day}
          </div>
        ))}
      </div>

      {/* 주간 날짜들 */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, i) => (
          <DayButton key={date.toISOString()} date={date} dayIndex={i} todos={getTodosForDate(date)} isSelected={selectedDate ? isSameDay(date, selectedDate) : false} onSelectDate={onSelectDate} />
        ))}
      </div>

      {/* 선택된 날짜 정보 */}
      {selectedDate && (
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-stone-700 dark:text-stone-300">{format(selectedDate, "M월 d일 (EEEE)", { locale: ko })}</h3>
            <button onClick={clearSelectedDate} className="text-xs text-stone-500 hover:text-orange-500 transition-colors">
              선택 해제
            </button>
          </div>

          {selectedDateTodos.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {selectedDateTodos.map((todo) => (
                <li key={todo.id} className={`p-2 rounded-lg text-sm ${todo.completed ? "bg-green-50 dark:bg-green-900/20 text-stone-500 line-through" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"}`}>
                  {todo.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">이 날짜에 할 일이 없습니다</p>
          )}
        </div>
      )}

      {/* 이번 주 요약 */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-500">{weekLabel} 할 일</span>
          <span className="text-orange-500 font-bold">{weekTodoCount}개</span>
        </div>
      </div>
    </div>
  );
});

// 개별 날짜 버튼 컴포넌트 (메모이제이션)
type DayButtonProps = {
  date: Date;
  dayIndex: number;
  todos: Todo[];
  isSelected: boolean;
  onSelectDate: (date: Date | null) => void;
};

const DayButton = memo(function DayButton({ date, dayIndex, todos, isSelected, onSelectDate }: DayButtonProps) {
  const isTodayDate = isToday(date);
  const completedCount = todos.filter((t) => t.completed).length;
  const hasIncomplete = completedCount < todos.length;

  const handleClick = useCallback(() => {
    onSelectDate(isSelected ? null : date);
  }, [onSelectDate, isSelected, date]);

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-xl transition-all flex flex-col items-center min-h-[80px] ${
        isSelected ? "bg-orange-500 text-white" : isTodayDate ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "hover:bg-stone-100 dark:hover:bg-stone-800"
      }`}
    >
      <span className={`text-lg font-semibold ${isSelected ? "text-white" : dayIndex === 0 ? "text-red-500" : dayIndex === 6 ? "text-blue-500" : "text-stone-700 dark:text-stone-300"}`}>{format(date, "d")}</span>

      {todos.length > 0 && (
        <div className="flex gap-0.5 mt-1">
          {todos.slice(0, 3).map((_, idx) => (
            <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : hasIncomplete ? "bg-orange-500" : "bg-green-500"}`} />
          ))}
        </div>
      )}

      {todos.length > 0 && <span className={`text-[10px] mt-1 ${isSelected ? "text-white/80" : "text-stone-500 dark:text-stone-400"}`}>{todos.length}개</span>}
    </button>
  );
});

export default WeekView;
