import { memo } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { Todo, TrashItem } from "@/types/todo";
import { SelectedDateBanner, ProgressBar } from "../ui";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import TrashPanel from "./TrashPanel";

type TodoPanelProps = {
  todos: Todo[];
  selectedDate: Date | null;
  completedCount: number;
  onAdd: (text: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onAddSubTodo: (todoId: string, text: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onDeleteSubTodo: (todoId: string, subTodoId: string) => void;
  onToggleTodo: (todoId: string) => void;
  onToggleSubTodo: (todoId: string, subTodoId: string) => void;
  onSetDate: (todoId: string, date: string | null) => void;
  onClearSelectedDate: () => void;
  onEditTodo?: (todoId: string, newText: string) => void;
  onEditSubTodo?: (todoId: string, subTodoId: string, newText: string) => void;
  trash?: TrashItem[];
  onRestoreFromTrash?: (trashItemId: string) => void;
  onDeleteFromTrash?: (trashItemId: string) => void;
  onEmptyTrash?: () => void;
};

function TodoPanel({ todos, selectedDate, completedCount, onAdd, onDragEnd, onAddSubTodo, onDeleteTodo, onDeleteSubTodo, onToggleTodo, onToggleSubTodo, onSetDate, onClearSelectedDate, onEditTodo, onEditSubTodo, trash = [], onRestoreFromTrash, onDeleteFromTrash, onEmptyTrash }: TodoPanelProps) {
  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-stone-200 dark:border-stone-700 transition-colors">
      {selectedDate && <SelectedDateBanner selectedDate={selectedDate} onClear={onClearSelectedDate} />}

      <div className="mb-6">
        <TodoInput onAdd={onAdd} />
      </div>

      <TodoList todos={todos} onDragEnd={onDragEnd} onAddSubTodo={onAddSubTodo} onDeleteTodo={onDeleteTodo} onDeleteSubTodo={onDeleteSubTodo}
        onToggleTodo={onToggleTodo} onToggleSubTodo={onToggleSubTodo} onSetDate={onSetDate} onEditTodo={onEditTodo} onEditSubTodo={onEditSubTodo} />

      {todos.length > 0 && <ProgressBar completedCount={completedCount} totalCount={todos.length} />}

      {onRestoreFromTrash && onDeleteFromTrash && onEmptyTrash && (
        <TrashPanel trash={trash} onRestore={onRestoreFromTrash} onDelete={onDeleteFromTrash} onEmptyTrash={onEmptyTrash} />
      )}
    </div>
  );
}

export default memo(TodoPanel);

