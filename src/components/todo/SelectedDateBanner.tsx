import { memo } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";

type SelectedDateBannerProps = {
  selectedDate: Date;
  onClear: () => void;
};

function SelectedDateBanner({ selectedDate, onClear }: SelectedDateBannerProps) {
  return (
    <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 flex items-center justify-between">
      <p className="text-sm text-orange-700 dark:text-orange-300">
        📅 {format(selectedDate, "yyyy년 M월 d일")}에 할 일 추가 중
      </p>
      <button
        onClick={onClear}
        className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default memo(SelectedDateBanner);

