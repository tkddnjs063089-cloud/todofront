import { memo } from "react";

type ProgressBarProps = {
  completedCount: number;
  totalCount: number;
};

function ProgressBar({ completedCount, totalCount }: ProgressBarProps) {
  return (
    <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
      <div className="flex items-center justify-between text-sm">
        <span className="text-stone-500 dark:text-stone-400">완료</span>
        <span className="text-orange-500 font-bold">
          {completedCount} / {totalCount}개
        </span>
      </div>
    </div>
  );
}

export default memo(ProgressBar);

