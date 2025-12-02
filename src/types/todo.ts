// 서브 투두 타입
export type SubTodo = {
  id: string;
  text: string;
  completed: boolean;
};

// 메인 투두 타입
export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  date: string | null; // 날짜 (YYYY-MM-DD 형식) 또는 null
  subTodos: SubTodo[];
};
