import { useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { Todo } from "@/types/todo";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;

export function useDragTodo(setTodos: SetTodos) {
  // 드래그 종료 시 순서 변경
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setTodos((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    [setTodos]
  );

  return { handleDragEnd };
}

