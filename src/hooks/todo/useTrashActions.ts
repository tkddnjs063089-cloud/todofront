"use client";

import { useCallback } from "react";
import { Todo, TrashItem } from "@/types/todo";
import {
  fetchTodos,
  restoreTodoApi,
  restoreSubTodoApi,
  permanentDeleteTodoApi,
  permanentDeleteSubTodoApi,
  emptyTrashApi,
} from "@/api";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;
type SetTrash = React.Dispatch<React.SetStateAction<TrashItem[]>>;

export function useTrashActions(trash: TrashItem[], setTodos: SetTodos, setTrash: SetTrash) {
  // 휴지통에서 복원
  const restoreFromTrash = useCallback(
    async (trashItemId: string) => {
      const item = trash.find((t) => t.id === trashItemId);
      if (!item) return;

      setTrash((prev) => prev.filter((t) => t.id !== trashItemId));

      if (item.type === "todo") {
        const restoredTodo: Todo = {
          id: item.id,
          text: item.text,
          completed: item.completed,
          date: item.date || null,
          subTodos: item.subTodos || [],
        };
        setTodos((prev) => [restoredTodo, ...prev]);
      }

      try {
        if (item.type === "todo") {
          await restoreTodoApi(trashItemId);
        } else {
          await restoreSubTodoApi(trashItemId);
        }
        if (item.type === "subTodo") {
          const todosData = await fetchTodos();
          setTodos(todosData);
        }
      } catch (error) {
        setTrash((prev) => [item, ...prev]);
        if (item.type === "todo") {
          setTodos((prev) => prev.filter((t) => t.id !== item.id));
        }
        console.error("Failed to restore:", error);
      }
    },
    [trash, setTodos, setTrash]
  );

  // 휴지통에서 영구 삭제
  const deleteFromTrash = useCallback(
    async (trashItemId: string) => {
      const item = trash.find((t) => t.id === trashItemId);
      if (!item) return;

      setTrash((prev) => prev.filter((t) => t.id !== trashItemId));

      try {
        if (item.type === "todo") {
          await permanentDeleteTodoApi(trashItemId);
        } else {
          await permanentDeleteSubTodoApi(trashItemId);
        }
      } catch (error) {
        setTrash((prev) => [item, ...prev]);
        console.error("Failed to delete permanently:", error);
      }
    },
    [trash, setTrash]
  );

  // 휴지통 비우기
  const emptyTrash = useCallback(async () => {
    const oldTrash = [...trash];
    setTrash([]);

    try {
      await emptyTrashApi();
    } catch (error) {
      setTrash(oldTrash);
      console.error("Failed to empty trash:", error);
    }
  }, [trash, setTrash]);

  return { restoreFromTrash, deleteFromTrash, emptyTrash };
}

