import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatDateTime } from '@/utils/format';

const ActivityFeed = ({ activities = [], className = '' }) => {
  const getActivityIcon = (action) => {
    if (action.includes('Created')) return 'Plus';
    if (action.includes('Updated')) return 'Edit';
    if (action.includes('Paused')) return 'Pause';
    if (action.includes('Deleted')) return 'Trash2';
    return 'Activity';
  };

  const getActivityColor = (action) => {
    if (action.includes('Created')) return 'text-success';
    if (action.includes('Updated')) return 'text-secondary';
    if (action.includes('Paused')) return 'text-warning';
    if (action.includes('Deleted')) return 'text-error';
    return 'text-surface-600';
  };

  const staggerVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-surface-200 ${className}`}>
      <div className="p-6 border-b border-surface-200">
        <h2 className="text-xl font-semibold text-surface-900 flex items-center gap-2">
          <ApperIcon name="Activity" size={20} />
          Recent Activity
        </h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.Id}
              initial="initial"
              animate="animate"
              variants={staggerVariants}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 hover:bg-surface-50 rounded-lg transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface-100 ${getActivityColor(activity.action)}`}>
                <ApperIcon name={getActivityIcon(activity.action)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-surface-900">{activity.action}</p>
                  <span className="text-sm text-surface-500">
                    by {activity.userId.split('@')[0]}
                  </span>
                </div>
                
                <p className="text-sm text-surface-600 mb-2">
                  {activity.entityType} • {formatDateTime(activity.timestamp)}
                </p>
                
                {activity.details && (
                  <div className="text-sm text-surface-700">
                    {activity.details.campaignName && (
                      <span className="font-medium">{activity.details.campaignName}</span>
                    )}
                    {activity.details.clientName && (
                      <span className="font-medium">{activity.details.clientName}</span>
                    )}
                    {activity.details.strategyName && (
                      <span className="font-medium">{activity.details.strategyName}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;