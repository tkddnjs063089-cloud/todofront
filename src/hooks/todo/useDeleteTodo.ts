import { useCallback } from "react";
import { Todo } from "@/types/todo";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;

export function useDeleteTodo(setTodos: SetTodos) {
  // 메인 투두 삭제
  const deleteTodo = useCallback(
    (todoId: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    },
    [setTodos]
  );

  // 서브 투두 삭제
  const deleteSubTodo = useCallback(
    (todoId: string, subTodoId: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                subTodos: todo.subTodos.filter((sub) => sub.id !== subTodoId),
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  return { deleteTodo, deleteSubTodo };
}

