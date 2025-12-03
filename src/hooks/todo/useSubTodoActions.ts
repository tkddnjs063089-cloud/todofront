"use client";

import { useCallback } from "react";
import { Todo } from "@/types/todo";
import { createSubTodo, updateSubTodo, deleteSubTodoApi, fetchTrash } from "@/api";
import { generateTempId } from "@/utils";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;
type SetTrash = React.Dispatch<React.SetStateAction<any[]>>;

export function useSubTodoActions(todos: Todo[], setTodos: SetTodos, setTrash: SetTrash) {
  // SubTodo 추가
  const addSubTodo = useCallback(
    async (todoId: string, text: string) => {
      const tempId = generateTempId();
      const optimisticSubTodo = { id: tempId, text, completed: false };

      setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, subTodos: [...todo.subTodos, optimisticSubTodo] } : todo)));

      try {
        const newSubTodo = await createSubTodo(todoId, text);
        setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, subTodos: todo.subTodos.map((s) => (s.id === tempId ? newSubTodo : s)) } : todo)));
      } catch (error) {
        setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, subTodos: todo.subTodos.filter((s) => s.id !== tempId) } : todo)));
        console.error("Failed to create subtodo:", error);
      }
    },
    [setTodos]
  );

  // SubTodo 토글
  const toggleSubTodo = useCallback(
    async (todoId: string, subTodoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      const subTodo = todo?.subTodos.find((s) => s.id === subTodoId);
      if (!todo || !subTodo) return;

      const newCompleted = !subTodo.completed;

      setTodos((prev) =>
        prev.map((t) => {
          if (t.id !== todoId) return t;
          const updatedSubTodos = t.subTodos.map((s) => (s.id === subTodoId ? { ...s, completed: newCompleted } : s));
          const allCompleted = updatedSubTodos.length > 0 && updatedSubTodos.every((s) => s.completed);
          return { ...t, subTodos: updatedSubTodos, completed: allCompleted };
        })
      );

      try {
        await updateSubTodo(todoId, subTodoId, { completed: newCompleted });
      } catch (error) {
        setTodos((prev) =>
          prev.map((t) => {
            if (t.id !== todoId) return t;
            const rolledBack = t.subTodos.map((s) => (s.id === subTodoId ? { ...s, completed: !newCompleted } : s));
            const allCompleted = rolledBack.length > 0 && rolledBack.every((s) => s.completed);
            return { ...t, subTodos: rolledBack, completed: allCompleted };
          })
        );
        console.error("Failed to toggle subtodo:", error);
      }
    },
    [todos, setTodos]
  );

  // SubTodo 수정
  const editSubTodo = useCallback(
    async (todoId: string, subTodoId: string, newText: string) => {
      const todo = todos.find((t) => t.id === todoId);
      const subTodo = todo?.subTodos.find((s) => s.id === subTodoId);
      if (!subTodo) return;

      const oldText = subTodo.text;
      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, subTodos: t.subTodos.map((s) => (s.id === subTodoId ? { ...s, text: newText } : s)) } : t)));

      try {
        await updateSubTodo(todoId, subTodoId, { text: newText });
      } catch (error) {
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, subTodos: t.subTodos.map((s) => (s.id === subTodoId ? { ...s, text: oldText } : s)) } : t)));
        console.error("Failed to edit subtodo:", error);
      }
    },
    [todos, setTodos]
  );

  // SubTodo 삭제
  const deleteSubTodo = useCallback(
    async (todoId: string, subTodoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      const deletedSubTodo = todo?.subTodos.find((s) => s.id === subTodoId);
      if (!deletedSubTodo) return;

      setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, subTodos: t.subTodos.filter((s) => s.id !== subTodoId) } : t)));

      try {
        await deleteSubTodoApi(todoId, subTodoId);
        fetchTrash().then(setTrash);
      } catch (error) {
        setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, subTodos: [...t.subTodos, deletedSubTodo] } : t)));
        console.error("Failed to delete subtodo:", error);
      }
    },
    [todos, setTodos, setTrash]
  );

  return { addSubTodo, toggleSubTodo, editSubTodo, deleteSubTodo };
}
