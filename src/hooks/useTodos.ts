"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Todo, TrashItem } from "@/types/todo";
import { 
  fetchTodos, createTodo, updateTodo, deleteTodoApi, 
  createSubTodo, updateSubTodo, deleteSubTodoApi,
  fetchTrash, restoreTodoApi, restoreSubTodoApi, 
  permanentDeleteTodoApi, permanentDeleteSubTodoApi, emptyTrashApi 
} from "@/api";
import { useDragTodo } from "./todo";

export function useTodos() {
  // ========== 상태 ==========
  const [todos, setTodos] = useState<Todo[]>([]);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ========== 드래그 (로컬) ==========
  const { handleDragEnd } = useDragTodo(setTodos);

  // ========== 초기 데이터 로드 ==========
  useEffect(() => {
    loadData();
  }, []);

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

  // ========== Todo 추가 ==========
  const addTodo = useCallback(async (text: string) => {
    try {
      const dateStr = selectedDate ? selectedDate.toISOString().split("T")[0] : null;
      const newTodo = await createTodo(text, dateStr);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  }, [selectedDate]);

  // ========== SubTodo 추가 ==========
  const addSubTodo = useCallback(async (todoId: string, text: string) => {
    try {
      const newSubTodo = await createSubTodo(todoId, text);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId ? { ...todo, subTodos: [...todo.subTodos, newSubTodo] } : todo
        )
      );
    } catch (error) {
      console.error("Failed to create subtodo:", error);
    }
  }, []);

  // ========== Todo 토글 ==========
  const toggleTodo = useCallback(async (todoId: string) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;
    try {
      const updated = await updateTodo(todoId, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)));
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  }, [todos]);

  // ========== SubTodo 토글 ==========
  const toggleSubTodo = useCallback(async (todoId: string, subTodoId: string) => {
    const todo = todos.find((t) => t.id === todoId);
    const subTodo = todo?.subTodos.find((s) => s.id === subTodoId);
    if (!subTodo) return;
    try {
      await updateSubTodo(todoId, subTodoId, { completed: !subTodo.completed });
      // 서버에서 부모 Todo도 업데이트하므로 전체 다시 로드
      const todosData = await fetchTodos();
      setTodos(todosData);
    } catch (error) {
      console.error("Failed to toggle subtodo:", error);
    }
  }, [todos]);

  // ========== Todo 수정 ==========
  const editTodo = useCallback(async (todoId: string, newText: string) => {
    try {
      const updated = await updateTodo(todoId, { text: newText });
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)));
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  }, []);

  // ========== SubTodo 수정 ==========
  const editSubTodo = useCallback(async (todoId: string, subTodoId: string, newText: string) => {
    try {
      const updated = await updateSubTodo(todoId, subTodoId, { text: newText });
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? { ...todo, subTodos: todo.subTodos.map((s) => (s.id === subTodoId ? updated : s)) }
            : todo
        )
      );
    } catch (error) {
      console.error("Failed to edit subtodo:", error);
    }
  }, []);

  // ========== Todo 삭제 (휴지통으로) ==========
  const deleteTodo = useCallback(async (todoId: string) => {
    try {
      await deleteTodoApi(todoId);
      // 로컬 상태 업데이트 & 휴지통 새로고침
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      const trashData = await fetchTrash();
      setTrash(trashData);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }, []);

  // ========== SubTodo 삭제 (휴지통으로) ==========
  const deleteSubTodo = useCallback(async (todoId: string, subTodoId: string) => {
    try {
      await deleteSubTodoApi(todoId, subTodoId);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? { ...todo, subTodos: todo.subTodos.filter((s) => s.id !== subTodoId) }
            : todo
        )
      );
      const trashData = await fetchTrash();
      setTrash(trashData);
    } catch (error) {
      console.error("Failed to delete subtodo:", error);
    }
  }, []);

  // ========== 날짜 설정 ==========
  const setTodoDate = useCallback(async (todoId: string, date: string | null) => {
    try {
      const updated = await updateTodo(todoId, { date });
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)));
    } catch (error) {
      console.error("Failed to set date:", error);
    }
  }, []);

  const clearSelectedDate = useCallback(() => {
    setSelectedDate(null);
  }, []);

  // ========== 휴지통 - 복원 ==========
  const restoreFromTrash = useCallback(async (trashItemId: string) => {
    const item = trash.find((t) => t.id === trashItemId);
    if (!item) return;
    try {
      if (item.type === "todo") {
        await restoreTodoApi(trashItemId);
      } else {
        await restoreSubTodoApi(trashItemId);
      }
      // 데이터 새로고침
      await loadData();
    } catch (error) {
      console.error("Failed to restore:", error);
    }
  }, [trash]);

  // ========== 휴지통 - 영구 삭제 ==========
  const deleteFromTrash = useCallback(async (trashItemId: string) => {
    const item = trash.find((t) => t.id === trashItemId);
    if (!item) return;
    try {
      if (item.type === "todo") {
        await permanentDeleteTodoApi(trashItemId);
      } else {
        await permanentDeleteSubTodoApi(trashItemId);
      }
      setTrash((prev) => prev.filter((t) => t.id !== trashItemId));
    } catch (error) {
      console.error("Failed to delete permanently:", error);
    }
  }, [trash]);

  // ========== 휴지통 비우기 ==========
  const emptyTrash = useCallback(async () => {
    try {
      await emptyTrashApi();
      setTrash([]);
    } catch (error) {
      console.error("Failed to empty trash:", error);
    }
  }, []);

  // ========== 계산된 값 ==========
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);

  // ========== 컴포넌트별 Props ==========
  const todoPanelProps = useMemo(() => ({
    todos,
    selectedDate,
    completedCount,
    isLoading,
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
    trash,
    onRestoreFromTrash: restoreFromTrash,
    onDeleteFromTrash: deleteFromTrash,
    onEmptyTrash: emptyTrash,
  }), [todos, selectedDate, completedCount, isLoading, addTodo, handleDragEnd, addSubTodo, deleteTodo, deleteSubTodo, toggleTodo, toggleSubTodo, setTodoDate, clearSelectedDate, editTodo, editSubTodo, trash, restoreFromTrash, deleteFromTrash, emptyTrash]);

  const weekViewProps = useMemo(() => ({
    todos,
    selectedDate,
    onSelectDate: setSelectedDate,
  }), [todos, selectedDate]);

  return {
    todoPanelProps,
    weekViewProps,
  };
}
