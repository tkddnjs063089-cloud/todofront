import { useCallback } from "react";
import { format } from "date-fns";
import { Todo } from "@/types/todo";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;

export function useAddTodo(setTodos: SetTodos, selectedDate: Date | null) {
  // 메인 투두 추가
  const addTodo = useCallback(
    (text: string) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text,
        completed: false,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
        subTodos: [],
      };
      setTodos((prev) => [...prev, newTodo]);
    },
    [setTodos, selectedDate]
  );

  // 서브 투두 추가
  const addSubTodo = useCallback(
    (todoId: string, text: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                subTodos: [...todo.subTodos, { id: Date.now().toString(), text, completed: false }],
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  return { addTodo, addSubTodo };
}
