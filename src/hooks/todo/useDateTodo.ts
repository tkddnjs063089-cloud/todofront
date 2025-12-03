import { useCallback } from "react";
import { Todo } from "@/types/todo";

type SetTodos = React.Dispatch<React.SetStateAction<Todo[]>>;
type SetSelectedDate = React.Dispatch<React.SetStateAction<Date | null>>;

export function useDateTodo(setTodos: SetTodos, setSelectedDate: SetSelectedDate) {
  // 투두 날짜 설정
  const setTodoDate = useCallback(
    (todoId: string, date: string | null) => {
      setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, date } : todo)));
    },
    [setTodos]
  );

  // 날짜 선택 해제
  const clearSelectedDate = useCallback(() => {
    setSelectedDate(null);
  }, [setSelectedDate]);

  return { setTodoDate, clearSelectedDate };
}

