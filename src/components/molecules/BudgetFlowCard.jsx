import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatCurrency } from '@/utils/format';
import ProgressBar from '@/components/atoms/ProgressBar';

const BudgetFlowCard = ({ 
  title, 
  total, 
  allocated, 
  spent, 
  allocations = [],
  className = '' 
}) => {
  const unallocated = total - allocated;
  const remaining = allocated - spent;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`bg-white rounded-lg p-6 shadow-md border border-surface-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-surface-600">
          <ApperIcon name="DollarSign" size={16} />
          <span>{formatCurrency(total)} total</span>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <p className="text-sm text-surface-600">Allocated</p>
          <p className="text-xl font-bold text-success">{formatCurrency(allocated)}</p>
        </div>
        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <p className="text-sm text-surface-600">Spent</p>
          <p className="text-xl font-bold text-warning">{formatCurrency(spent)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <ProgressBar 
          value={spent} 
          max={allocated} 
          showPercentage={true}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-surface-600">
          <span>Remaining: {formatCurrency(remaining)}</span>
          <span>Unallocated: {formatCurrency(unallocated)}</span>
        </div>
      </div>

      {/* Allocations */}
      {allocations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-surface-700 mb-3">Budget Allocations</h4>
          <div className="space-y-2">
            {allocations.map((allocation, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-surface-50 rounded">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    allocation.type === 'strategy' ? 'bg-secondary' : 'bg-surface-400'
                  }`} />
                  <span className="text-sm text-surface-700">{allocation.name}</span>
                </div>
                <span className="text-sm font-medium text-surface-900">
                  {formatCurrency(allocation.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BudgetFlowCard;