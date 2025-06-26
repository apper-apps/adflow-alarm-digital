import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useNavigate } from 'react-router-dom';

const Manage = () => {
  const navigate = useNavigate();

  const managementSections = [
    {
      title: 'Client Management',
      description: 'Add, edit, and manage your car dealership clients',
      icon: 'Users',
      color: 'bg-primary/10 text-primary',
      actions: [
        { label: 'View Clients', action: () => navigate('/clients'), icon: 'Eye' },
        { label: 'Add Client', action: () => navigate('/clients/create'), icon: 'Plus' }
      ]
    },
    {
      title: 'Strategy Management',
      description: 'Create and manage high-level campaign strategies',
      icon: 'Target',
      color: 'bg-secondary/10 text-secondary',
      actions: [
        { label: 'Create Strategy', action: () => navigate('/strategies/create'), icon: 'Plus' },
        { label: 'View Dashboard', action: () => navigate('/'), icon: 'LayoutDashboard' }
      ]
    },
    {
      title: 'Campaign Management',
      description: 'Launch and manage individual advertising campaigns',
      icon: 'Zap',
      color: 'bg-accent/10 text-accent',
      actions: [
        { label: 'Create Campaign', action: () => navigate('/campaigns/create'), icon: 'Plus' },
        { label: 'View Activity', action: () => navigate('/activity'), icon: 'Activity' }
      ]
    },
    {
      title: 'Budget Management',
      description: 'Allocate and track campaign budgets',
      icon: 'DollarSign',
      color: 'bg-warning/10 text-warning',
      actions: [
        { label: 'View Budgets', action: () => navigate('/budgets'), icon: 'Eye' },
        { label: 'Create Budget', action: () => navigate('/budgets/create'), icon: 'Plus' }
      ]
    },
    {
      title: 'Performance Tracking',
      description: 'Monitor campaign performance and pacing',
      icon: 'TrendingUp',
      color: 'bg-success/10 text-success',
      actions: [
        { label: 'View Pacing', action: () => navigate('/pacing'), icon: 'TrendingUp' },
        { label: 'View Reports', action: () => navigate('/reports'), icon: 'BarChart3' }
      ]
    },
    {
      title: 'System Settings',
      description: 'Platform integrations and system configuration',
      icon: 'Settings',
      color: 'bg-surface-500/10 text-surface-600',
      actions: [
        { label: 'Platform Integrations', action: () => {}, icon: 'Plug' },
        { label: 'User Management', action: () => {}, icon: 'UserCog' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Settings" size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Manage Platform</h1>
            <p className="text-surface-600">Centralized management for all your campaign operations</p>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md border border-surface-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${section.color}`}>
                <ApperIcon name={section.icon} size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-surface-900">{section.title}</h3>
              </div>
            </div>
            
            <p className="text-surface-600 mb-6">{section.description}</p>
            
            <div className="space-y-2">
              {section.actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  variant="ghost"
                  size="sm"
                  icon={action.icon}
                  onClick={action.action}
                  className="w-full justify-start"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            icon="Plus"
            onClick={() => navigate('/clients/create')}
            className="h-12"
          >
            Add Client
          </Button>
          <Button
            variant="outline"
            icon="Target"
            onClick={() => navigate('/strategies/create')}
            className="h-12"
          >
            Create Strategy
          </Button>
          <Button
            variant="outline"
            icon="Zap"
            onClick={() => navigate('/campaigns/create')}
            className="h-12"
          >
            Launch Campaign
          </Button>
          <Button
            variant="outline"
            icon="DollarSign"
            onClick={() => navigate('/budgets/create')}
            className="h-12"
          >
            Setup Budget
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Manage;