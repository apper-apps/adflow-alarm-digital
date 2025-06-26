const ProgressBar = ({ value, max, showPercentage = true, className = '' }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  const getProgressColor = (percent) => {
    if (percent >= 90) return 'bg-error';
    if (percent >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {showPercentage && (
          <span className="text-sm font-medium text-surface-700">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-surface-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;