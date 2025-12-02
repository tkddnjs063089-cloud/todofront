import { useState, KeyboardEvent } from "react";
import { Plus } from "lucide-react";

type TodoInputProps = {
  onAdd: (text: string) => void;
  placeholder?: string;
};

export default function TodoInput({ onAdd, placeholder = "할 일을 입력하세요..." }: TodoInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() === "") return;
    onAdd(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 rounded-xl px-4 py-3 text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-orange-500 transition-colors"
      />
      <button
        onClick={handleAdd}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
