"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Todo, TrashItem } from "@/types/todo";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodoApi,
  createSubTodo,
  updateSubTodo,
  deleteSubTodoApi,
  fetchTrash,
  restoreTodoApi,
  restoreSubTodoApi,
  permanentDeleteTodoApi,
  permanentDeleteSubTodoApi,
  emptyTrashApi,
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

  // ========== Todo 추가 (Optimistic Update) ==========
  const addTodo = useCallback(
    async (text: string) => {
      // 로컬 시간 기준 날짜 문자열 (UTC 변환 방지)
      const dateStr = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}` : null;

      // 1. 임시 ID로 먼저 화면에 표시 (즉시!)
      const tempId = `temp-${Date.now()}`;
      const optimisticTodo: Todo = {
        id: tempId,
        text,
        completed: false,
        date: dateStr,
        subTodos: [],
      };
      setTodos((prev) => [optimisticTodo, ...prev]);

      try {
        // 2. 백그라운드에서 서버에 저장
        const newTodo = await createTodo(text, dateStr);
        // 3. 임시 ID를 실제 ID로 교체
        setTodos((prev) => prev.map((t) => (t.id === tempId ? newTodo : t)));
      } catch (error) {
        // 4. 실패 시 롤백 (화면에서 제거)
        setTodos((prev) => prev.filter((t) => t.id !== tempId));
        console.error("Failed to create todo:", error);
      }
    },
    [selectedDate]
  );

  // ========== SubTodo 추가 (Optimistic Update) ==========
  const addSubTodo = useCallback(async (todoId: string, text: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticSubTodo = { id: tempId, text, completed: false };

    // 1. 먼저 화면에 표시
    setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, subTodos: [...todo.subTodos, optimisticSubTodo] } : todo)));

    try {
      // 2. 서버에 저장
      const newSubTodo = await createSubTodo(todoId, text);
      // 3. 임시 ID를 실제 ID로 교체
      setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, subTodos: todo.subTodos.map((s) => (s.id === tempId ? newSubTodo : s)) } : todo)));
    } catch (error) {
      // 4. 실패 시 롤백
      setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, subTodos: todo.subTodos.filter((s) => s.id !== tempId) } : todo)));
      console.error("Failed to create subtodo:", error);
    }
  }, []);

  // ========== Todo 토글 (Optimistic Update) ==========
  const toggleTodo = useCallback(
    async (todoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) return;

      const newCompleted = !todo.completed;
      // 1. 먼저 화면에 반영
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, completed: newCompleted } : t)));

      try {
        // 2. 서버에 저장
        await updateTodo(todoId, { completed: newCompleted });
      } catch (error) {
        // 3. 실패 시 롤백
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, completed: !newCompleted } : t)));
        console.error("Failed to toggle todo:", error);
      }
    },
    [todos]
  );

  // ========== SubTodo 토글 (Optimistic Update) ==========
  const toggleSubTodo = useCallback(
    async (todoId: string, subTodoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      const subTodo = todo?.subTodos.find((s) => s.id === subTodoId);
      if (!todo || !subTodo) return;

      const newCompleted = !subTodo.completed;
      // 1. 먼저 화면에 반영 (subTodo + 부모 todo 완료 상태 계산)
      setTodos((prev) =>
        prev.map((t) => {
          if (t.id !== todoId) return t;
          const updatedSubTodos = t.subTodos.map((s) => (s.id === subTodoId ? { ...s, completed: newCompleted } : s));
          const allSubTodosCompleted = updatedSubTodos.length > 0 && updatedSubTodos.every((s) => s.completed);
          return { ...t, subTodos: updatedSubTodos, completed: allSubTodosCompleted };
        })
      );

      try {
        // 2. 서버에 저장
        await updateSubTodo(todoId, subTodoId, { completed: newCompleted });
      } catch (error) {
        // 3. 실패 시 롤백
        setTodos((prev) =>
          prev.map((t) => {
            if (t.id !== todoId) return t;
            const rolledBackSubTodos = t.subTodos.map((s) => (s.id === subTodoId ? { ...s, completed: !newCompleted } : s));
            const allSubTodosCompleted = rolledBackSubTodos.length > 0 && rolledBackSubTodos.every((s) => s.completed);
            return { ...t, subTodos: rolledBackSubTodos, completed: allSubTodosCompleted };
          })
        );
        console.error("Failed to toggle subtodo:", error);
      }
    },
    [todos]
  );

  // ========== Todo 수정 (Optimistic Update) ==========
  const editTodo = useCallback(
    async (todoId: string, newText: string) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) return;

      const oldText = todo.text;
      // 1. 먼저 화면에 반영
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, text: newText } : t)));

      try {
        // 2. 서버에 저장
        await updateTodo(todoId, { text: newText });
      } catch (error) {
        // 3. 실패 시 롤백
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, text: oldText } : t)));
        console.error("Failed to edit todo:", error);
      }
    },
    [todos]
  );

  // ========== SubTodo 수정 (Optimistic Update) ==========
  const editSubTodo = useCallback(
    async (todoId: string, subTodoId: string, newText: string) => {
      const todo = todos.find((t) => t.id === todoId);
      const subTodo = todo?.subTodos.find((s) => s.id === subTodoId);
      if (!subTodo) return;

      const oldText = subTodo.text;
      // 1. 먼저 화면에 반영
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, subTodos: t.subTodos.map((s) => (s.id === subTodoId ? { ...s, text: newText } : s)) } : t)));

      try {
        // 2. 서버에 저장
        await updateSubTodo(todoId, subTodoId, { text: newText });
      } catch (error) {
        // 3. 실패 시 롤백
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, subTodos: t.subTodos.map((s) => (s.id === subTodoId ? { ...s, text: oldText } : s)) } : t)));
        console.error("Failed to edit subtodo:", error);
      }
    },
    [todos]
  );

  // ========== Todo 삭제 (Optimistic Update) ==========
  const deleteTodo = useCallback(
    async (todoId: string) => {
      const deletedTodo = todos.find((t) => t.id === todoId);
      if (!deletedTodo) return;

      // 1. 먼저 화면에서 제거
      setTodos((prev) => prev.filter((t) => t.id !== todoId));

      try {
        // 2. 서버에서 삭제
        await deleteTodoApi(todoId);
        // 3. 휴지통 새로고침 (백그라운드)
        fetchTrash().then(setTrash);
      } catch (error) {
        // 4. 실패 시 롤백
        setTodos((prev) => [deletedTodo, ...prev]);
        console.error("Failed to delete todo:", error);
      }
    },
    [todos]
  );

  // ========== SubTodo 삭제 (Optimistic Update) ==========
  const deleteSubTodo = useCallback(
    async (todoId: string, subTodoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      const deletedSubTodo = todo?.subTodos.find((s) => s.id === subTodoId);
      if (!deletedSubTodo) return;

      // 1. 먼저 화면에서 제거
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, subTodos: t.subTodos.filter((s) => s.id !== subTodoId) } : t)));

      try {
        // 2. 서버에서 삭제
        await deleteSubTodoApi(todoId, subTodoId);
        // 3. 휴지통 새로고침 (백그라운드)
        fetchTrash().then(setTrash);
      } catch (error) {
        // 4. 실패 시 롤백
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, subTodos: [...t.subTodos, deletedSubTodo] } : t)));
        console.error("Failed to delete subtodo:", error);
      }
    },
    [todos]
  );

  // ========== 날짜 설정 (Optimistic Update) ==========
  const setTodoDate = useCallback(
    async (todoId: string, date: string | null) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) return;

      const oldDate = todo.date;
      // 1. 먼저 화면에 반영
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, date } : t)));

      try {
        // 2. 서버에 저장
        await updateTodo(todoId, { date });
      } catch (error) {
        // 3. 실패 시 롤백
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, date: oldDate } : t)));
        console.error("Failed to set date:", error);
      }
    },
    [todos]
  );

  const clearSelectedDate = useCallback(() => {
    setSelectedDate(null);
  }, []);

  // ========== 휴지통 - 복원 ==========
  const restoreFromTrash = useCallback(
    async (trashItemId: string) => {
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
    },
    [trash]
  );

  // ========== 휴지통 - 영구 삭제 ==========
  const deleteFromTrash = useCallback(
    async (trashItemId: string) => {
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
    },
    [trash]
  );

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
  const todoPanelProps = useMemo(
    () => ({
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
    }),
    [
      todos,
      selectedDate,
      completedCount,
      isLoading,
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
      trash,
      restoreFromTrash,
      deleteFromTrash,
      emptyTrash,
    ]
  );

  const weekViewProps = useMemo(
    () => ({
      todos,
      selectedDate,
      onSelectDate: setSelectedDate,
    }),
    [todos, selectedDate]
  );

  return {
    todoPanelProps,
    weekViewProps,
  };
}
