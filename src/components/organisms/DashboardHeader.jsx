import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import MetricCard from '@/components/atoms/MetricCard';

const DashboardHeader = ({ 
  metrics = [],
  onCreateClient,
  onCreateCampaign 
}) => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const itemVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="bg-white rounded-lg shadow-md border border-surface-200 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Dashboard Overview</h1>
          <p className="text-surface-600">Monitor your clients' campaign performance and budget utilization</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            icon="Plus" 
            onClick={onCreateClient}
          >
            New Client
          </Button>
          <Button 
            icon="Zap" 
            onClick={onCreateCampaign}
          >
            New Campaign
          </Button>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default DashboardHeader;