import { memo } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { Todo } from "@/types/todo";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import SelectedDateBanner from "./SelectedDateBanner";
import ProgressBar from "./ProgressBar";

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
};

function TodoPanel({
  todos,
  selectedDate,
  completedCount,
  onAdd,
  onDragEnd,
  onAddSubTodo,
  onDeleteTodo,
  onDeleteSubTodo,
  onToggleTodo,
  onToggleSubTodo,
  onSetDate,
  onClearSelectedDate,
}: TodoPanelProps) {
  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-stone-200 dark:border-stone-700 transition-colors">
      {/* 선택된 날짜 표시 */}
      {selectedDate && <SelectedDateBanner selectedDate={selectedDate} onClear={onClearSelectedDate} />}

      {/* 입력 영역 */}
      <div className="mb-6">
        <TodoInput onAdd={onAdd} />
      </div>

      {/* 할 일 목록 */}
      <TodoList
        todos={todos}
        onDragEnd={onDragEnd}
        onAddSubTodo={onAddSubTodo}
        onDeleteTodo={onDeleteTodo}
        onDeleteSubTodo={onDeleteSubTodo}
        onToggleTodo={onToggleTodo}
        onToggleSubTodo={onToggleSubTodo}
        onSetDate={onSetDate}
      />

      {/* 진행 상황 */}
      {todos.length > 0 && <ProgressBar completedCount={completedCount} totalCount={todos.length} />}
    </div>
  );
}

export default memo(TodoPanel);

