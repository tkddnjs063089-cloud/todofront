import { memo } from "react";
import { Check } from "lucide-react";

type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  size?: "sm" | "md";
};

function Checkbox({ checked, onChange, size = "md" }: CheckboxProps) {
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const iconSize = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <button
      onClick={onChange}
      className={`${sizeClasses} rounded border-2 flex items-center justify-center transition-all shrink-0 ${
        checked ? "bg-green-500 border-green-500 text-white" : "border-stone-400 dark:border-stone-500 hover:border-orange-500"
      }`}
    >
      {checked && <Check className={iconSize} />}
    </button>
  );
}

export default memo(Checkbox);

