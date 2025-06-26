import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/atoms/StatusBadge';
import MetricCard from '@/components/atoms/MetricCard';
import BudgetFlowCard from '@/components/molecules/BudgetFlowCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import clientService from '@/services/api/clientService';
import strategyService from '@/services/api/strategyService';
import campaignService from '@/services/api/campaignService';
import budgetService from '@/services/api/budgetService';
import { formatCurrency, formatDate } from '@/utils/format';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [client, setClient] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClientData();
  }, [id]);

  const loadClientData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [clientData, strategiesData, campaignsData, budgetsData] = await Promise.all([
        clientService.getById(id),
        strategyService.getByClientId(id),
        campaignService.getAll(),
        budgetService.getByClientId(id)
      ]);
      
      setClient(clientData);
      setStrategies(strategiesData);
      setCampaigns(campaignsData);
      setBudgets(budgetsData);
    } catch (err) {
      setError(err.message || 'Failed to load client data');
      toast.error('Failed to load client data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const clientCampaigns = campaigns.filter(c => 
      strategies.some(s => s.Id === c.strategyId)
    );
    
    const totalSpent = clientCampaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalBudget = strategies.reduce((sum, s) => sum + s.allocatedBudget, 0);
    const activeCampaigns = clientCampaigns.filter(c => c.status === 'Active').length;
    const activeStrategies = strategies.filter(s => s.status === 'Active').length;

    return [
      {
        title: 'Total Budget',
        value: client?.totalBudget || 0,
        format: 'currency',
        icon: 'DollarSign'
      },
      {
        title: 'Total Spent',
        value: totalSpent,
        format: 'currency',
        icon: 'TrendingUp'
      },
      {
        title: 'Active Strategies',
        value: activeStrategies,
        icon: 'Target'
      },
      {
        title: 'Active Campaigns',
        value: activeCampaigns,
        icon: 'Zap'
      }
    ];
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'strategies', label: 'Strategies', icon: 'Target' },
    { id: 'pacing', label: 'Pacing', icon: 'TrendingUp' },
    { id: 'budgets', label: 'Budgets', icon: 'DollarSign' },
    { id: 'integrations', label: 'Integrations', icon: 'Settings' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadClientData}
        />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <ErrorState message="Client not found" />
      </div>
    );
  }

  const metrics = calculateMetrics();
  const budget = budgets[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon="ArrowLeft"
              onClick={() => navigate('/clients')}
            >
              Back to Clients
            </Button>
            <div className="w-px h-8 bg-surface-200"></div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">{client.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-surface-600">
                  <ApperIcon name="MapPin" size={16} />
                  <span>{client.location}</span>
                </div>
                <div className="flex items-center gap-2 text-surface-600">
                  <ApperIcon name="Car" size={16} />
                  <span>{client.dealershipType}</span>
                </div>
                <StatusBadge status={client.status} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              icon="Plus"
              onClick={() => navigate('/strategies/create', { state: { clientId: client.Id } })}
            >
              New Strategy
            </Button>
            <Button 
              icon="Zap"
              onClick={() => navigate('/campaigns/create', { state: { clientId: client.Id } })}
            >
              New Campaign
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-surface-200">
        <div className="border-b border-surface-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {budget && (
                <BudgetFlowCard
                  title="Budget Overview"
                  total={budget.total}
                  allocated={budget.allocations.reduce((sum, a) => sum + a.amount, 0)}
                  spent={campaigns.reduce((sum, c) => sum + c.spent, 0)}
                  allocations={budget.allocations}
                />
              )}
              
              <div className="bg-surface-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Client Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-surface-600">Contact:</span>
                    <span className="font-medium">{client.contact?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Email:</span>
                    <span className="font-medium">{client.contact?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Phone:</span>
                    <span className="font-medium">{client.contact?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Created:</span>
                    <span className="font-medium">{formatDate(client.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'strategies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <motion.div
                  key={strategy.Id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-surface-50 rounded-lg p-6 border border-surface-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-surface-900">{strategy.name}</h3>
                    <StatusBadge status={strategy.status} />
                  </div>
                  <p className="text-sm text-surface-600 mb-4">{strategy.goal}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-600">Budget:</span>
                      <span className="font-medium">{formatCurrency(strategy.allocatedBudget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-600">Target:</span>
                      <span className="font-medium">{strategy.targetAudience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-600">KPI:</span>
                      <span className="font-medium">{strategy.kpi}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'pacing' && (
            <div className="text-center py-12">
              <ApperIcon name="TrendingUp" size={48} className="text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Pacing Analytics</h3>
              <p className="text-surface-600">Advanced pacing analytics and budget burn rate visualization coming soon.</p>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="space-y-6">
              {budget && (
                <BudgetFlowCard
                  title="Detailed Budget Breakdown"
                  total={budget.total}
                  allocated={budget.allocations.reduce((sum, a) => sum + a.amount, 0)}
                  spent={campaigns.reduce((sum, c) => sum + c.spent, 0)}
                  allocations={budget.allocations}
                />
              )}
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="text-center py-12">
              <ApperIcon name="Settings" size={48} className="text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Platform Integrations</h3>
              <p className="text-surface-600">Connect with Google Ads, Facebook Ads, and other advertising platforms.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClientDetail;