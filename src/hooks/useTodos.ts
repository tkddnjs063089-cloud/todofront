"use client";

import { useState, useMemo } from "react";
import { Todo } from "@/types/todo";
import { useAddTodo, useDeleteTodo, useToggleTodo, useDateTodo, useDragTodo } from "./todo";

export function useTodos() {
  // ========== 상태 ==========
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // ========== 액션 훅 ==========
  const { addTodo, addSubTodo } = useAddTodo(setTodos, selectedDate);
  const { deleteTodo, deleteSubTodo } = useDeleteTodo(setTodos);
  const { toggleTodo, toggleSubTodo } = useToggleTodo(setTodos);
  const { setTodoDate, clearSelectedDate } = useDateTodo(setTodos, setSelectedDate);
  const { handleDragEnd } = useDragTodo(setTodos);

  // ========== 계산된 값 ==========
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);

  // ========== 컴포넌트별 Props ==========
  const todoPanelProps = useMemo(
    () => ({
      todos,
      selectedDate,
      completedCount,
      onAdd: addTodo,
      onDragEnd: handleDragEnd,
      onAddSubTodo: addSubTodo,
      onDeleteTodo: deleteTodo,
      onDeleteSubTodo: deleteSubTodo,
      onToggleTodo: toggleTodo,
      onToggleSubTodo: toggleSubTodo,
      onSetDate: setTodoDate,
      onClearSelectedDate: clearSelectedDate,
    }),
    [todos, selectedDate, completedCount, addTodo, handleDragEnd, addSubTodo, deleteTodo, deleteSubTodo, toggleTodo, toggleSubTodo, setTodoDate, clearSelectedDate]
  );

  const weekViewProps = useMemo(
    () => ({
      todos,
      selectedDate,
      onSelectDate: setSelectedDate,
    }),
    [todos, selectedDate, setSelectedDate]
  );

  return {
    todoPanelProps,
    weekViewProps,
  };
}
