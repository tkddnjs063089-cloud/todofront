import { useState, memo, useCallback } from "react";
import { GripVertical, Plus, CornerDownRight, X, Calendar, Pencil } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Todo } from "@/types/todo";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { IconButton, Checkbox } from "../ui";
import SubTodoItem from "./SubTodoItem";

type TodoItemProps = {
  todo: Todo;
  index: number;
  onAddSubTodo: (todoId: string, text: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onDeleteSubTodo: (todoId: string, subTodoId: string) => void;
  onToggleTodo: (todoId: string) => void;
  onToggleSubTodo: (todoId: string, subTodoId: string) => void;
  onSetDate: (todoId: string, date: string | null) => void;
  onEditTodo?: (todoId: string, newText: string) => void;
  onEditSubTodo?: (todoId: string, subTodoId: string, newText: string) => void;
};

const TodoItem = memo(function TodoItem({ todo, index, onAddSubTodo, onDeleteTodo, onDeleteSubTodo, onToggleTodo, onToggleSubTodo, onSetDate, onEditTodo, onEditSubTodo }: TodoItemProps) {
  const [isAddingSubTodo, setIsAddingSubTodo] = useState(false);
  const [subTodoInput, setSubTodoInput] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleSave = useCallback((text: string) => onEditTodo?.(todo.id, text), [onEditTodo, todo.id]);
  const { isEditing, editText, setEditText, startEdit, saveEdit, handleKeyDown } = useInlineEdit({ initialText: todo.text, onSave: handleSave });

  const handleAddSubTodo = useCallback(() => {
    if (subTodoInput.trim() === "") return;
    onAddSubTodo(todo.id, subTodoInput);
    setSubTodoInput("");
    setIsAddingSubTodo(false);
  }, [subTodoInput, onAddSubTodo, todo.id]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSetDate(todo.id, e.target.value || null);
    setIsDatePickerOpen(false);
  }, [onSetDate, todo.id]);

  const handleClearDate = useCallback(() => {
    onSetDate(todo.id, null);
    setIsDatePickerOpen(false);
  }, [onSetDate, todo.id]);

  const containerStyle = `flex items-center gap-3 bg-stone-100 dark:bg-stone-800/50 p-4 rounded-xl border transition-all group ${
    todo.completed ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20" : "border-stone-300 dark:border-stone-700 hover:border-orange-500/50"
  } ${isDragging ? "opacity-50 border-orange-500 shadow-lg" : ""}`;

  const textStyle = todo.completed ? "line-through text-stone-400 dark:text-stone-500" : "text-stone-800 dark:text-stone-200";

  return (
    <li ref={setNodeRef} style={style} className="space-y-2">
      <div className={containerStyle}>
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-stone-400 dark:text-stone-500 hover:text-orange-500 transition-colors">
          <GripVertical className="w-5 h-5" />
        </button>

        <span className="text-xs text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">#{index + 1}</span>

        <div className="flex-1">
          {isEditing ? (
            <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={handleKeyDown} onBlur={saveEdit}
              className="w-full bg-white dark:bg-stone-700 border border-orange-500 rounded px-2 py-1 text-stone-800 dark:text-white focus:outline-none" autoFocus />
          ) : (
            <span onDoubleClick={startEdit} className={`cursor-pointer transition-all ${textStyle}`}>{todo.text}</span>
          )}
          {todo.date && !isEditing && <span className="ml-2 text-xs text-orange-500 dark:text-orange-400">📅 {format(new Date(todo.date), "M/d", { locale: ko })}</span>}
        </div>

        {!isEditing && <IconButton onClick={startEdit} showOnHover><Pencil className="w-4 h-4" /></IconButton>}
        
        <div className="relative">
          <IconButton onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} showOnHover active={!!todo.date}>
            <Calendar className="w-4 h-4" />
          </IconButton>
          {isDatePickerOpen && (
            <div className="absolute right-0 top-8 z-10 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 p-2">
              <input type="date" value={todo.date || ""} onChange={handleDateChange} className="text-sm bg-transparent text-stone-800 dark:text-stone-200 outline-none" />
              {todo.date && <button onClick={handleClearDate} className="block w-full mt-1 text-xs text-red-500 hover:text-red-600">날짜 삭제</button>}
            </div>
          )}
        </div>

        <IconButton onClick={() => setIsAddingSubTodo(!isAddingSubTodo)} showOnHover><Plus className="w-4 h-4" /></IconButton>
        <Checkbox checked={todo.completed} onChange={() => onToggleTodo(todo.id)} />
        <IconButton onClick={() => onDeleteTodo(todo.id)} variant="danger" showOnHover><X className="w-4 h-4" /></IconButton>
      </div>

      {isAddingSubTodo && (
        <div className="ml-8 flex gap-2">
          <CornerDownRight className="w-4 h-4 text-stone-400 dark:text-stone-500 mt-3" />
          <input type="text" value={subTodoInput} onChange={(e) => setSubTodoInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleAddSubTodo()}
            placeholder="하위 할 일 입력..." className="flex-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg px-3 py-2 text-sm text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-orange-500" autoFocus />
          <button onClick={handleAddSubTodo} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm">추가</button>
        </div>
      )}

      {todo.subTodos.length > 0 && (
        <ul className="ml-8 space-y-2">
          {todo.subTodos.map((subTodo) => (
            <SubTodoItem key={subTodo.id} subTodo={subTodo} todoId={todo.id} onToggle={onToggleSubTodo} onDelete={onDeleteSubTodo} onEdit={onEditSubTodo} />
          ))}
        </ul>
      )}
    </li>
  );
});

export default TodoItem;

