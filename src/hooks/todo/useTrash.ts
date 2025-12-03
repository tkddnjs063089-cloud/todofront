import { useState, useCallback } from "react";
import { Todo, SubTodo, TrashItem } from "@/types/todo";
import { v4 as uuidv4 } from "uuid";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;

export function useTrash(setTodos: SetTodos) {
  const [trash, setTrash] = useState<TrashItem[]>([]);

  // 투두를 휴지통으로 이동
  const moveToTrash = useCallback(
    (todo: Todo) => {
      const trashItem: TrashItem = {
        id: uuidv4(),
        type: "todo",
        text: todo.text,
        completed: todo.completed,
        date: todo.date,
        subTodos: todo.subTodos,
        deletedAt: new Date().toISOString(),
      };
      setTrash((prev) => [trashItem, ...prev]);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    },
    [setTodos]
  );

  // 서브투두를 휴지통으로 이동
  const moveSubTodoToTrash = useCallback(
    (todoId: string, subTodo: SubTodo) => {
      const trashItem: TrashItem = {
        id: uuidv4(),
        type: "subTodo",
        originalTodoId: todoId,
        text: subTodo.text,
        completed: subTodo.completed,
        date: null,
        subTodos: [],
        deletedAt: new Date().toISOString(),
      };
      setTrash((prev) => [trashItem, ...prev]);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? { ...todo, subTodos: todo.subTodos.filter((s) => s.id !== subTodo.id) }
            : todo
        )
      );
    },
    [setTodos]
  );

  // 휴지통에서 복원
  const restoreFromTrash = useCallback(
    (trashItemId: string) => {
      const item = trash.find((t) => t.id === trashItemId);
      if (!item) return;

      if (item.type === "todo") {
        // 투두 복원
        const restoredTodo: Todo = {
          id: uuidv4(),
          text: item.text,
          completed: item.completed,
          date: item.date,
          subTodos: item.subTodos,
        };
        setTodos((prev) => [...prev, restoredTodo]);
      } else if (item.type === "subTodo" && item.originalTodoId) {
        // 서브투두 복원 - 원래 부모 투두가 있는지 확인
        setTodos((prev) => {
          const parentExists = prev.some((t) => t.id === item.originalTodoId);
          if (parentExists) {
            return prev.map((todo) =>
              todo.id === item.originalTodoId
                ? {
                    ...todo,
                    subTodos: [
                      ...todo.subTodos,
                      { id: uuidv4(), text: item.text, completed: item.completed },
                    ],
                  }
                : todo
            );
          } else {
            // 부모 투두가 없으면 새 투두로 생성
            const newTodo: Todo = {
              id: uuidv4(),
              text: item.text,
              completed: item.completed,
              date: null,
              subTodos: [],
            };
            return [...prev, newTodo];
          }
        });
      }

      // 휴지통에서 제거
      setTrash((prev) => prev.filter((t) => t.id !== trashItemId));
    },
    [trash, setTodos]
  );

  // 휴지통에서 영구 삭제
  const deleteFromTrash = useCallback((trashItemId: string) => {
    setTrash((prev) => prev.filter((t) => t.id !== trashItemId));
  }, []);

  // 휴지통 비우기
  const emptyTrash = useCallback(() => {
    setTrash([]);
  }, []);

  return {
    trash,
    moveToTrash,
    moveSubTodoToTrash,
    restoreFromTrash,
    deleteFromTrash,
    emptyTrash,
  };
}

