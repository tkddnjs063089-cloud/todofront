import { useCallback } from "react";
import { Todo } from "@/types/todo";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;

export function useEditTodo(setTodos: SetTodos) {
  // 메인 투두 텍스트 수정
  const editTodo = useCallback(
    (todoId: string, newText: string) => {
      if (newText.trim() === "") return;
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId ? { ...todo, text: newText.trim() } : todo
        )
      );
    },
    [setTodos]
  );

  // 서브 투두 텍스트 수정
  const editSubTodo = useCallback(
    (todoId: string, subTodoId: string, newText: string) => {
      if (newText.trim() === "") return;
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                subTodos: todo.subTodos.map((sub) =>
                  sub.id === subTodoId ? { ...sub, text: newText.trim() } : sub
                ),
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  return { editTodo, editSubTodo };
}

