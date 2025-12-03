import { useCallback } from "react";
import { Todo } from "@/types/todo";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;

export function useToggleTodo(setTodos: SetTodos) {
  // 메인 투두 완료 토글
  const toggleTodo = useCallback(
    (todoId: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                completed: !todo.completed,
                subTodos: todo.subTodos.map((sub) => ({
                  ...sub,
                  completed: !todo.completed,
                })),
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  // 서브 투두 완료 토글
  const toggleSubTodo = useCallback(
    (todoId: string, subTodoId: string) => {
      setTodos((prev) =>
        prev.map((todo) => {
          if (todo.id !== todoId) return todo;

          const updatedSubTodos = todo.subTodos.map((sub) =>
            sub.id === subTodoId ? { ...sub, completed: !sub.completed } : sub
          );
          const allSubTodosCompleted =
            updatedSubTodos.length > 0 && updatedSubTodos.every((sub) => sub.completed);

          return {
            ...todo,
            subTodos: updatedSubTodos,
            completed: allSubTodosCompleted,
          };
        })
      );
    },
    [setTodos]
  );

  return { toggleTodo, toggleSubTodo };
}

