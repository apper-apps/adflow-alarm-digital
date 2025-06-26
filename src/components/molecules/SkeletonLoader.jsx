const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-surface-200">
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-surface-200 rounded w-full"></div>
              <div className="h-3 bg-surface-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;