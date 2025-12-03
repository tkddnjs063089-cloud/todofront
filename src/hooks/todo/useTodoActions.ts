"use client";

import { useCallback } from "react";
import { Todo } from "@/types/todo";
import { createTodo, updateTodo, deleteTodoApi, fetchTrash } from "@/api";
import { formatDateToString, generateTempId } from "@/utils";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;
type SetTrash = React.Dispatch<React.SetStateAction<any[]>>;

export function useTodoActions(
  todos: Todo[],
  setTodos: SetTodos,
  setTrash: SetTrash,
  selectedDate: Date | null
) {
  // Todo 추가
  const addTodo = useCallback(
    async (text: string) => {
      const dateStr = formatDateToString(selectedDate);
      const tempId = generateTempId();
      const optimisticTodo: Todo = { id: tempId, text, completed: false, date: dateStr, subTodos: [] };

      setTodos((prev) => [optimisticTodo, ...prev]);

      try {
        const newTodo = await createTodo(text, dateStr);
        setTodos((prev) => prev.map((t) => (t.id === tempId ? newTodo : t)));
      } catch (error) {
        setTodos((prev) => prev.filter((t) => t.id !== tempId));
        console.error("Failed to create todo:", error);
      }
    },
    [selectedDate, setTodos]
  );

  // Todo 토글
  const toggleTodo = useCallback(
    async (todoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) return;

      const newCompleted = !todo.completed;
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, completed: newCompleted } : t)));

      try {
        await updateTodo(todoId, { completed: newCompleted });
      } catch (error) {
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, completed: !newCompleted } : t)));
        console.error("Failed to toggle todo:", error);
      }
    },
    [todos, setTodos]
  );

  // Todo 수정
  const editTodo = useCallback(
    async (todoId: string, newText: string) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) return;

      const oldText = todo.text;
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, text: newText } : t)));

      try {
        await updateTodo(todoId, { text: newText });
      } catch (error) {
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, text: oldText } : t)));
        console.error("Failed to edit todo:", error);
      }
    },
    [todos, setTodos]
  );

  // Todo 삭제
  const deleteTodo = useCallback(
    async (todoId: string) => {
      const deletedTodo = todos.find((t) => t.id === todoId);
      if (!deletedTodo) return;

      setTodos((prev) => prev.filter((t) => t.id !== todoId));

      try {
        await deleteTodoApi(todoId);
        fetchTrash().then(setTrash);
      } catch (error) {
        setTodos((prev) => [deletedTodo, ...prev]);
        console.error("Failed to delete todo:", error);
      }
    },
    [todos, setTodos, setTrash]
  );

  // 날짜 설정
  const setTodoDate = useCallback(
    async (todoId: string, date: string | null) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) return;

      const oldDate = todo.date;
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, date } : t)));

      try {
        await updateTodo(todoId, { date });
      } catch (error) {
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, date: oldDate } : t)));
        console.error("Failed to set date:", error);
      }
    },
    [todos, setTodos]
  );

  return { addTodo, toggleTodo, editTodo, deleteTodo, setTodoDate };
}

