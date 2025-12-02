"use client";

import { useState, useCallback, useMemo } from "react";
import { Mountain, X } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { format } from "date-fns";
import { Todo } from "@/types/todo";
import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";
import BackgroundAnimals from "@/components/BackgroundAnimals";
import WeekView from "@/components/WeekView";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 메인 투두 추가
  const addTodo = useCallback(
    (text: string) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text,
        completed: false,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
        subTodos: [],
      };
      setTodos((prev) => [...prev, newTodo]);
    },
    [selectedDate]
  );

  // 서브 투두 추가
  const addSubTodo = useCallback((todoId: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTodos: [...todo.subTodos, { id: Date.now().toString(), text, completed: false }],
            }
          : todo
      )
    );
  }, []);

  // 메인 투두 삭제
  const deleteTodo = useCallback((todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  }, []);

  // 서브 투두 삭제
  const deleteSubTodo = useCallback((todoId: string, subTodoId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTodos: todo.subTodos.filter((sub) => sub.id !== subTodoId),
            }
          : todo
      )
    );
  }, []);

  // 메인 투두 완료 토글
  const toggleTodo = useCallback((todoId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              completed: !todo.completed,
              subTodos: todo.subTodos.map((sub) => ({
                ...sub,
                completed: !todo.completed,
              })),
            }
          : todo
      )
    );
  }, []);

  // 서브 투두 완료 토글
  const toggleSubTodo = useCallback((todoId: string, subTodoId: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== todoId) return todo;

        const updatedSubTodos = todo.subTodos.map((sub) => (sub.id === subTodoId ? { ...sub, completed: !sub.completed } : sub));
        const allSubTodosCompleted = updatedSubTodos.length > 0 && updatedSubTodos.every((sub) => sub.completed);

        return {
          ...todo,
          subTodos: updatedSubTodos,
          completed: allSubTodosCompleted,
        };
      })
    );
  }, []);

  // 투두 날짜 설정
  const setTodoDate = useCallback((todoId: string, date: string | null) => {
    setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, date } : todo)));
  }, []);

  // 드래그 종료 시 순서 변경
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  // 날짜 선택 해제
  const clearSelectedDate = useCallback(() => {
    setSelectedDate(null);
  }, []);

  // 완료된 투두 개수 (메모이제이션)
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-100 to-orange-100 dark:from-slate-800 dark:via-stone-700 dark:to-amber-900 py-10 px-4 transition-colors">
      {/* 산 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 dark:opacity-10">
        <Mountain className="absolute bottom-0 left-0 w-96 h-96 text-stone-500 dark:text-white" />
        <Mountain className="absolute bottom-0 right-10 w-64 h-64 text-stone-500 dark:text-white" />
      </div>

      {/* 동물 배경 */}
      <BackgroundAnimals />

      {/* 헤더 - 전체 너비 */}
      <div className="max-w-6xl mx-auto relative mb-8">
        <Header />
      </div>

      {/* 메인 컨텐츠 - 좌우 분할 */}
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 투두리스트 */}
          <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-stone-200 dark:border-stone-700 transition-colors">
            {/* 선택된 날짜 표시 */}
            {selectedDate && (
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 flex items-center justify-between">
                <p className="text-sm text-orange-700 dark:text-orange-300">📅 {format(selectedDate, "yyyy년 M월 d일")}에 할 일 추가 중</p>
                <button onClick={clearSelectedDate} className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 입력 영역 */}
            <div className="mb-6">
              <TodoInput onAdd={addTodo} />
            </div>

            {/* 할 일 목록 */}
            <TodoList
              todos={todos}
              onDragEnd={handleDragEnd}
              onAddSubTodo={addSubTodo}
              onDeleteTodo={deleteTodo}
              onDeleteSubTodo={deleteSubTodo}
              onToggleTodo={toggleTodo}
              onToggleSubTodo={toggleSubTodo}
              onSetDate={setTodoDate}
            />

            {/* 진행 상황 */}
            {todos.length > 0 && (
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400">완료</span>
                  <span className="text-orange-500 font-bold">
                    {completedCount} / {todos.length}개
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 주간 뷰 */}
          <WeekView todos={todos} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        {/* 푸터 */}
        <p className="text-center text-stone-400 dark:text-stone-500 text-xs mt-6">🧗 Climb Your Day</p>
      </div>
    </div>
  );
}
