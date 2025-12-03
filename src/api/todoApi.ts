import { Todo, SubTodo, TrashItem } from "@/types/todo";

// 백엔드 API 주소 (환경변수 또는 기본값)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://todobackend-il7a.onrender.com/api";

// ==================== 메인 Todo ====================

// 전체 조회
export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${API_URL}/todos`);
  const json = await res.json();
  return json.data || [];
}

// 생성
export async function createTodo(text: string, date: string | null): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, date }),
  });
  const json = await res.json();
  return json.data;
}

// 수정
export async function updateTodo(id: string, data: { text?: string; completed?: boolean; date?: string | null }): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

// 삭제 (Soft Delete - 휴지통으로)
export async function deleteTodoApi(id: string): Promise<void> {
  await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
}

// ==================== 서브 Todo ====================

// 생성
export async function createSubTodo(todoId: string, text: string): Promise<SubTodo> {
  const res = await fetch(`${API_URL}/todos/${todoId}/subtodos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const json = await res.json();
  return json.data;
}

// 수정
export async function updateSubTodo(todoId: string, subTodoId: string, data: { text?: string; completed?: boolean }): Promise<SubTodo> {
  const res = await fetch(`${API_URL}/todos/${todoId}/subtodos/${subTodoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

// 삭제 (Soft Delete)
export async function deleteSubTodoApi(todoId: string, subTodoId: string): Promise<void> {
  await fetch(`${API_URL}/todos/${todoId}/subtodos/${subTodoId}`, { method: "DELETE" });
}

// ==================== 휴지통 ====================

// 휴지통 조회
export async function fetchTrash(): Promise<TrashItem[]> {
  const res = await fetch(`${API_URL}/trash`);
  const json = await res.json();
  return json.data || [];
}

// Todo 복원
export async function restoreTodoApi(id: string): Promise<void> {
  await fetch(`${API_URL}/trash/todos/${id}/restore`, { method: "POST" });
}

// SubTodo 복원
export async function restoreSubTodoApi(id: string): Promise<void> {
  await fetch(`${API_URL}/trash/subtodos/${id}/restore`, { method: "POST" });
}

// Todo 영구 삭제
export async function permanentDeleteTodoApi(id: string): Promise<void> {
  await fetch(`${API_URL}/trash/todos/${id}`, { method: "DELETE" });
}

// SubTodo 영구 삭제
export async function permanentDeleteSubTodoApi(id: string): Promise<void> {
  await fetch(`${API_URL}/trash/subtodos/${id}`, { method: "DELETE" });
}

// 휴지통 비우기
export async function emptyTrashApi(): Promise<void> {
  await fetch(`${API_URL}/trash`, { method: "DELETE" });
}
