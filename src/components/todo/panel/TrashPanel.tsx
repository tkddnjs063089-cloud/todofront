"use client";

import { memo, useState } from "react";
import { Trash2, RotateCcw, X, ChevronDown, ChevronUp } from "lucide-react";
import { TrashItem } from "@/types/todo";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

type TrashPanelProps = {
  trash: TrashItem[];
  onRestore: (trashItemId: string) => void;
  onDelete: (trashItemId: string) => void;
  onEmptyTrash: () => void;
};

function TrashPanel({ trash, onRestore, onDelete, onEmptyTrash }: TrashPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (trash.length === 0) return null;

  return (
    <div className="mt-6">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors w-full">
        <Trash2 className="w-4 h-4" />
        <span className="text-sm">휴지통 ({trash.length})</span>
        {isOpen ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </button>

      {isOpen && (
        <div className="mt-3 bg-stone-100 dark:bg-stone-800/50 rounded-xl p-4 border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-stone-500 dark:text-stone-400">삭제된 항목</span>
            <button onClick={onEmptyTrash} className="text-xs text-red-500 hover:text-red-600 transition-colors">전체 삭제</button>
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {trash.map((item) => <TrashItemRow key={item.id} item={item} onRestore={onRestore} onDelete={onDelete} />)}
          </ul>
        </div>
      )}
    </div>
  );
}

type TrashItemRowProps = {
  item: TrashItem;
  onRestore: (trashItemId: string) => void;
  onDelete: (trashItemId: string) => void;
};

const TrashItemRow = memo(function TrashItemRow({ item, onRestore, onDelete }: TrashItemRowProps) {
  const timeAgo = formatDistanceToNow(new Date(item.deletedAt), { addSuffix: true, locale: ko });
  const typeStyle = item.type === "todo" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";

  return (
    <li className="flex items-center gap-2 group/trash bg-white dark:bg-stone-700/50 p-2 rounded-lg">
      <span className={`text-xs px-1.5 py-0.5 rounded ${typeStyle}`}>{item.type === "todo" ? "할일" : "하위"}</span>
      <span className="flex-1 text-sm text-stone-600 dark:text-stone-300 truncate">{item.text}</span>
      {item.type === "todo" && item.subTodos.length > 0 && <span className="text-xs text-stone-400 dark:text-stone-500">+{item.subTodos.length}</span>}
      <span className="text-xs text-stone-400 dark:text-stone-500 opacity-0 group-hover/trash:opacity-100 transition-opacity">{timeAgo}</span>
      <button onClick={() => onRestore(item.id)} className="text-stone-400 hover:text-green-500 transition-colors opacity-0 group-hover/trash:opacity-100" title="복원">
        <RotateCcw className="w-4 h-4" />
      </button>
      <button onClick={() => onDelete(item.id)} className="text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover/trash:opacity-100" title="영구 삭제">
        <X className="w-4 h-4" />
      </button>
    </li>
  );
});

export default memo(TrashPanel);

