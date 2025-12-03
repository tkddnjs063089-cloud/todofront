import { memo, useCallback } from "react";
import { CornerDownRight, X, Pencil } from "lucide-react";
import { SubTodo } from "@/types/todo";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { IconButton, Checkbox } from "../ui";

type SubTodoItemProps = {
  subTodo: SubTodo;
  todoId: string;
  onToggle: (todoId: string, subTodoId: string) => void;
  onDelete: (todoId: string, subTodoId: string) => void;
  onEdit?: (todoId: string, subTodoId: string, newText: string) => void;
};

const SubTodoItem = memo(function SubTodoItem({ subTodo, todoId, onToggle, onDelete, onEdit }: SubTodoItemProps) {
  const handleSave = useCallback((text: string) => onEdit?.(todoId, subTodo.id, text), [onEdit, todoId, subTodo.id]);
  const { isEditing, editText, setEditText, startEdit, saveEdit, handleKeyDown } = useInlineEdit({ initialText: subTodo.text, onSave: handleSave });

  const handleToggle = useCallback(() => onToggle(todoId, subTodo.id), [onToggle, todoId, subTodo.id]);
  const handleDelete = useCallback(() => onDelete(todoId, subTodo.id), [onDelete, todoId, subTodo.id]);

  const baseStyle = subTodo.completed
    ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700/50"
    : "bg-stone-50 dark:bg-stone-800/30 border-stone-200 dark:border-stone-700/50";

  const textStyle = subTodo.completed
    ? "line-through text-stone-400 dark:text-stone-500"
    : "text-stone-700 dark:text-stone-300";

  return (
    <li className="flex items-center gap-2 group/sub">
      <CornerDownRight className="w-4 h-4 text-stone-400 dark:text-stone-500" />
      <div className={`flex-1 p-3 rounded-lg border text-sm flex items-center gap-2 transition-all ${baseStyle}`}>
        {isEditing ? (
          <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={handleKeyDown} onBlur={saveEdit}
            className="flex-1 bg-white dark:bg-stone-700 border border-orange-500 rounded px-2 py-0.5 text-sm text-stone-800 dark:text-white focus:outline-none" autoFocus />
        ) : (
          <span onDoubleClick={startEdit} className={`flex-1 cursor-pointer transition-all ${textStyle}`}>{subTodo.text}</span>
        )}
        {!isEditing && (
          <IconButton onClick={startEdit} showOnHover className="group-hover/sub:opacity-100"><Pencil className="w-3 h-3" /></IconButton>
        )}
        <Checkbox checked={subTodo.completed} onChange={handleToggle} size="sm" />
        <IconButton onClick={handleDelete} variant="danger" showOnHover className="group-hover/sub:opacity-100"><X className="w-3 h-3" /></IconButton>
      </div>
    </li>
  );
});

export default SubTodoItem;

