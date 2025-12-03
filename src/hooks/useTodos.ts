"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Todo, TrashItem } from "@/types/todo";
import { fetchTodos, fetchTrash } from "@/api";
import { useTodoActions, useSubTodoActions, useTrashActions, useDragTodo } from "./todo";

export function useTodos() {
  // ========== 상태 ==========
  const [todos, setTodos] = useState<Todo[]>([]);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ========== 초기 데이터 로드 ==========
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [todosData, trashData] = await Promise.all([fetchTodos(), fetchTrash()]);
        setTodos(todosData);
        setTrash(trashData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // ========== 액션 훅들 ==========
  const { handleDragEnd } = useDragTodo(setTodos);
  const { addTodo, toggleTodo, editTodo, deleteTodo, setTodoDate } = useTodoActions(todos, setTodos, setTrash, selectedDate);
  const { addSubTodo, toggleSubTodo, editSubTodo, deleteSubTodo } = useSubTodoActions(todos, setTodos, setTrash);
  const { restoreFromTrash, deleteFromTrash, emptyTrash } = useTrashActions(trash, setTodos, setTrash);

  // ========== 기타 액션 ==========
  const clearSelectedDate = useCallback(() => setSelectedDate(null), []);

  // ========== 계산된 값 ==========
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  // ========== 컴포넌트별 Props ==========
  const todoPanelProps = useMemo(
    () => ({
      todos,
      selectedDate,
      completedCount,
      isLoading,
      trash,
      onAdd: addTodo,
      onDragEnd: handleDragEnd,
      onAddSubTodo: addSubTodo,
      onDeleteTodo: deleteTodo,
      onDeleteSubTodo: deleteSubTodo,
      onToggleTodo: toggleTodo,
      onToggleSubTodo: toggleSubTodo,
      onSetDate: setTodoDate,
      onClearSelectedDate: clearSelectedDate,
      onEditTodo: editTodo,
      onEditSubTodo: editSubTodo,
      onRestoreFromTrash: restoreFromTrash,
      onDeleteFromTrash: deleteFromTrash,
      onEmptyTrash: emptyTrash,
    }),
    [
      todos,
      selectedDate,
      completedCount,
      isLoading,
      trash,
      addTodo,
      handleDragEnd,
      addSubTodo,
      deleteTodo,
      deleteSubTodo,
      toggleTodo,
      toggleSubTodo,
      setTodoDate,
      clearSelectedDate,
      editTodo,
      editSubTodo,
      restoreFromTrash,
      deleteFromTrash,
      emptyTrash,
    ]
  );

  const weekViewProps = useMemo(() => ({ todos, selectedDate, onSelectDate: setSelectedDate }), [todos, selectedDate]);

  return { todoPanelProps, weekViewProps };
}
