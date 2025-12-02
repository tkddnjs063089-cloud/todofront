import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Mountain } from "lucide-react";
import { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  onDragEnd: (event: DragEndEvent) => void;
  onAddSubTodo: (todoId: string, text: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onDeleteSubTodo: (todoId: string, subTodoId: string) => void;
  onToggleTodo: (todoId: string) => void;
  onToggleSubTodo: (todoId: string, subTodoId: string) => void;
  onSetDate: (todoId: string, date: string | null) => void;
};

export default function TodoList({
  todos,
  onDragEnd,
  onAddSubTodo,
  onDeleteTodo,
  onDeleteSubTodo,
  onToggleTodo,
  onToggleSubTodo,
  onSetDate,
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <Mountain className="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
        <p className="text-stone-500 dark:text-stone-500">아직 할 일이 없습니다</p>
        <p className="text-stone-400 dark:text-stone-600 text-sm mt-1">첫 번째 할 일을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-3">
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              onAddSubTodo={onAddSubTodo}
              onDeleteTodo={onDeleteTodo}
              onDeleteSubTodo={onDeleteSubTodo}
              onToggleTodo={onToggleTodo}
              onToggleSubTodo={onToggleSubTodo}
              onSetDate={onSetDate}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
