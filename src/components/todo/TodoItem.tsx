import { useState, memo, useCallback } from "react";
import { GripVertical, Plus, CornerDownRight, X, Check, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Todo, SubTodo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
  index: number;
  onAddSubTodo: (todoId: string, text: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onDeleteSubTodo: (todoId: string, subTodoId: string) => void;
  onToggleTodo: (todoId: string) => void;
  onToggleSubTodo: (todoId: string, subTodoId: string) => void;
  onSetDate: (todoId: string, date: string | null) => void;
};

const TodoItem = memo(function TodoItem({ todo, index, onAddSubTodo, onDeleteTodo, onDeleteSubTodo, onToggleTodo, onToggleSubTodo, onSetDate }: TodoItemProps) {
  const [isAddingSubTodo, setIsAddingSubTodo] = useState(false);
  const [subTodoInput, setSubTodoInput] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddSubTodo = useCallback(() => {
    if (subTodoInput.trim() === "") return;
    onAddSubTodo(todo.id, subTodoInput);
    setSubTodoInput("");
    setIsAddingSubTodo(false);
  }, [subTodoInput, onAddSubTodo, todo.id]);

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSetDate(todo.id, e.target.value || null);
      setIsDatePickerOpen(false);
    },
    [onSetDate, todo.id]
  );

  const handleToggleTodo = useCallback(() => {
    onToggleTodo(todo.id);
  }, [onToggleTodo, todo.id]);

  const handleDeleteTodo = useCallback(() => {
    onDeleteTodo(todo.id);
  }, [onDeleteTodo, todo.id]);

  const handleClearDate = useCallback(() => {
    onSetDate(todo.id, null);
    setIsDatePickerOpen(false);
  }, [onSetDate, todo.id]);

  return (
    <li ref={setNodeRef} style={style} className="space-y-2">
      {/* 메인 투두 */}
      <div
        className={`flex items-center gap-3 bg-stone-100 dark:bg-stone-800/50 p-4 rounded-xl border transition-all group ${
          todo.completed ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20" : "border-stone-300 dark:border-stone-700 hover:border-orange-500/50"
        } ${isDragging ? "opacity-50 border-orange-500 shadow-lg" : ""}`}
      >
        {/* 드래그 핸들 */}
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-stone-400 dark:text-stone-500 hover:text-orange-500 transition-colors">
          <GripVertical className="w-5 h-5" />
        </button>

        {/* 순서 - 왼쪽 */}
        <span className="text-xs text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">#{index + 1}</span>

        {/* 텍스트 + 날짜 */}
        <div className="flex-1">
          <span className={`transition-all ${todo.completed ? "line-through text-stone-400 dark:text-stone-500" : "text-stone-800 dark:text-stone-200"}`}>{todo.text}</span>
          {todo.date && <span className="ml-2 text-xs text-orange-500 dark:text-orange-400">📅 {format(new Date(todo.date), "M/d", { locale: ko })}</span>}
        </div>

        {/* 날짜 선택 버튼 */}
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className={`text-stone-400 dark:text-stone-500 hover:text-orange-500 transition-colors ${todo.date ? "text-orange-500" : "opacity-0 group-hover:opacity-100"}`}
          >
            <Calendar className="w-4 h-4" />
          </button>
          {isDatePickerOpen && (
            <div className="absolute right-0 top-8 z-10 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 p-2">
              <input type="date" value={todo.date || ""} onChange={handleDateChange} className="text-sm bg-transparent text-stone-800 dark:text-stone-200 outline-none" />
              {todo.date && (
                <button onClick={handleClearDate} className="block w-full mt-1 text-xs text-red-500 hover:text-red-600">
                  날짜 삭제
                </button>
              )}
            </div>
          )}
        </div>

        {/* 서브투두 추가 버튼 */}
        <button onClick={() => setIsAddingSubTodo(!isAddingSubTodo)} className="text-stone-400 dark:text-stone-500 hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100">
          <Plus className="w-4 h-4" />
        </button>

        {/* 체크박스 */}
        <button
          onClick={handleToggleTodo}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            todo.completed ? "bg-green-500 border-green-500 text-white" : "border-stone-400 dark:border-stone-500 hover:border-orange-500"
          }`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        {/* 삭제 버튼 */}
        <button onClick={handleDeleteTodo} className="text-stone-400 dark:text-stone-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 서브투두 입력창 */}
      {isAddingSubTodo && (
        <div className="ml-8 flex gap-2">
          <CornerDownRight className="w-4 h-4 text-stone-400 dark:text-stone-500 mt-3" />
          <input
            type="text"
            value={subTodoInput}
            onChange={(e) => setSubTodoInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSubTodo()}
            placeholder="하위 할 일 입력..."
            className="flex-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg px-3 py-2 text-sm text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-orange-500"
            autoFocus
          />
          <button onClick={handleAddSubTodo} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm">
            추가
          </button>
        </div>
      )}

      {/* 서브투두 목록 */}
      {todo.subTodos.length > 0 && (
        <ul className="ml-8 space-y-2">
          {todo.subTodos.map((subTodo: SubTodo) => (
            <SubTodoItem key={subTodo.id} subTodo={subTodo} todoId={todo.id} onToggleSubTodo={onToggleSubTodo} onDeleteSubTodo={onDeleteSubTodo} />
          ))}
        </ul>
      )}
    </li>
  );
});

// 서브투두 아이템 컴포넌트 (메모이제이션)
type SubTodoItemProps = {
  subTodo: SubTodo;
  todoId: string;
  onToggleSubTodo: (todoId: string, subTodoId: string) => void;
  onDeleteSubTodo: (todoId: string, subTodoId: string) => void;
};

const SubTodoItem = memo(function SubTodoItem({ subTodo, todoId, onToggleSubTodo, onDeleteSubTodo }: SubTodoItemProps) {
  const handleToggle = useCallback(() => {
    onToggleSubTodo(todoId, subTodo.id);
  }, [onToggleSubTodo, todoId, subTodo.id]);

  const handleDelete = useCallback(() => {
    onDeleteSubTodo(todoId, subTodo.id);
  }, [onDeleteSubTodo, todoId, subTodo.id]);

  return (
    <li className="flex items-center gap-2 group/sub">
      <CornerDownRight className="w-4 h-4 text-stone-400 dark:text-stone-500" />
      <div
        className={`flex-1 p-3 rounded-lg border text-sm flex items-center gap-2 transition-all ${
          subTodo.completed ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700/50" : "bg-stone-50 dark:bg-stone-800/30 border-stone-200 dark:border-stone-700/50"
        }`}
      >
        <span className={`flex-1 transition-all ${subTodo.completed ? "line-through text-stone-400 dark:text-stone-500" : "text-stone-700 dark:text-stone-300"}`}>{subTodo.text}</span>
        <button
          onClick={handleToggle}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
            subTodo.completed ? "bg-green-500 border-green-500 text-white" : "border-stone-400 dark:border-stone-500 hover:border-orange-500"
          }`}
        >
          {subTodo.completed && <Check className="w-2.5 h-2.5" />}
        </button>
        <button onClick={handleDelete} className="text-stone-400 dark:text-stone-500 hover:text-red-500 transition-colors opacity-0 group-hover/sub:opacity-100">
          <X className="w-3 h-3" />
        </button>
      </div>
    </li>
  );
});

export default TodoItem;

