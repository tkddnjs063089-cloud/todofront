import { memo } from "react";

type ProgressBarProps = {
  completedCount: number;
  totalCount: number;
};

function ProgressBar({ completedCount, totalCount }: ProgressBarProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-stone-600 dark:text-stone-400">진행률</span>
        <span className="text-orange-500 font-semibold">{completedCount}/{totalCount} ({percentage}%)</span>
      </div>
      <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default memo(ProgressBar);

