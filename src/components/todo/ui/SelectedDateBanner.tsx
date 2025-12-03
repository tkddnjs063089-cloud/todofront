import { memo } from "react";
import { CalendarPlus, X } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type SelectedDateBannerProps = {
  selectedDate: Date;
  onClear: () => void;
};

function SelectedDateBanner({ selectedDate, onClear }: SelectedDateBannerProps) {
  return (
    <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center gap-2 text-orange-700 dark:text-orange-300">
      <CalendarPlus className="w-5 h-5" />
      <span className="text-sm font-medium">
        {format(selectedDate, "M월 d일 (EEEE)", { locale: ko })}에 할 일 추가 중
      </span>
      <button onClick={onClear} className="ml-auto hover:text-orange-900 dark:hover:text-orange-100 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default memo(SelectedDateBanner);

