interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-blue transition-all duration-300 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
