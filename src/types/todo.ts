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

// 휴지통 아이템 타입
export type TrashItem = {
  id: string;
  type: "todo" | "subTodo";
  originalTodoId?: string; // 서브투두인 경우 원래 부모 투두 ID
  text: string;
  completed: boolean;
  date: string | null;
  subTodos: SubTodo[]; // 투두인 경우 서브투두들도 함께 저장
  deletedAt: string; // 삭제된 시간
};
