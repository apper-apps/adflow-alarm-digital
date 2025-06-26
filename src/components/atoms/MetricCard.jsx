import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatCurrency, formatPercentage } from '@/utils/format';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  format = 'number',
  className = '' 
}) => {
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val, 100);
      default:
        return val?.toLocaleString() || '0';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-surface-500';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg p-6 shadow-md border border-surface-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name={icon} size={20} className="text-primary" />
              </div>
            )}
            <h3 className="text-sm font-medium text-surface-600">{title}</h3>
          </div>
          <p className="text-2xl font-bold text-surface-900">{formatValue(value)}</p>
          
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 ${getTrendColor(trend)}`}>
              <ApperIcon name={getTrendIcon(trend)} size={16} />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;