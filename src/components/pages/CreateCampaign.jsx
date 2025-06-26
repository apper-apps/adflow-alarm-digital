import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import clientService from '@/services/api/clientService';
import strategyService from '@/services/api/strategyService';
import budgetService from '@/services/api/budgetService';
import campaignService from '@/services/api/campaignService';
import activityService from '@/services/api/activityService';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const location = useLocation();
const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    clientId: location.state?.clientId || '',
    strategyId: '',
    name: '',
    platform: '',
    budgetId: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadClients();
  }, []);

useEffect(() => {
    if (formData.clientId) {
      loadStrategies(formData.clientId);
      loadBudgets(formData.clientId);
    } else {
      setStrategies([]);
      setBudgets([]);
    }
  }, [formData.clientId]);

  const loadClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data.filter(c => c.status === 'Active'));
    } catch (error) {
      toast.error('Failed to load clients');
    }
  };

const loadStrategies = async (clientId) => {
    try {
      const data = await strategyService.getByClientId(clientId);
      setStrategies(data.filter(s => s.status === 'Active'));
    } catch (error) {
      toast.error('Failed to load strategies');
    }
  };

  const loadBudgets = async (clientId) => {
    try {
      const data = await budgetService.getByClientId(clientId);
      setBudgets(data);
    } catch (error) {
      toast.error('Failed to load budgets');
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client';
    }
    
    if (!formData.strategyId) {
      newErrors.strategyId = 'Please select a strategy';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    
    if (!formData.platform) {
      newErrors.platform = 'Please select a platform';
    }
    
if (!formData.budgetId) {
      newErrors.budgetId = 'Please select a budget';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
try {
       const campaignData = {
         strategyId: parseInt(formData.strategyId, 10),
         name: formData.name.trim(),
         platform: formData.platform,
         budgetId: parseInt(formData.budgetId, 10),
         startDate: new Date(formData.startDate).toISOString(),
         endDate: new Date(formData.endDate).toISOString()
       };
      
const newCampaign = await campaignService.create(campaignData);
      const client = clients.find(c => c.Id === parseInt(formData.clientId, 10));
      const selectedBudget = budgets.find(b => b.Id === parseInt(formData.budgetId, 10));
      
      // Log activity
      await activityService.create({
        userId: 'john.doe@agency.com',
        action: 'Created new campaign',
        entityType: 'Campaign',
        entityId: newCampaign.Id.toString(),
        details: {
          campaignName: newCampaign.name,
          platform: newCampaign.platform,
          budgetName: `Budget #${selectedBudget?.Id} ($${selectedBudget?.total?.toLocaleString()})`,
          clientName: client?.name
        }
      });
      
      toast.success('Campaign created successfully!');
      navigate(`/clients/${formData.clientId}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { value: 'Google Ads', label: 'Google Ads', icon: 'Search' },
    { value: 'Facebook', label: 'Facebook Ads', icon: 'Facebook' },
    { value: 'Instagram', label: 'Instagram Ads', icon: 'Instagram' },
    { value: 'YouTube', label: 'YouTube Ads', icon: 'Youtube' },
    { value: 'Display Network', label: 'Display Network', icon: 'Monitor' },
    { value: 'Email', label: 'Email Marketing', icon: 'Mail' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <div className="w-px h-8 bg-surface-200"></div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Create New Campaign</h1>
            <p className="text-surface-600">Set up a new advertising campaign for your client's strategy</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client & Strategy Selection */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Users" size={20} />
              Client & Strategy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Select Client <span className="text-error">*</span>
                </label>
                <select
                  value={formData.clientId}
                  onChange={handleInputChange('clientId')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary ${
                    errors.clientId ? 'border-error' : 'border-surface-300'
                  }`}
                >
                  <option value="">Choose a client...</option>
                  {clients.map(client => (
                    <option key={client.Id} value={client.Id}>
                      {client.name} - {client.dealershipType}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="mt-1 text-sm text-error flex items-center gap-1">
                    <ApperIcon name="AlertCircle" size={16} />
                    {errors.clientId}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Select Strategy <span className="text-error">*</span>
                </label>
                <select
                  value={formData.strategyId}
                  onChange={handleInputChange('strategyId')}
                  disabled={!formData.clientId}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary ${
                    errors.strategyId ? 'border-error' : 'border-surface-300'
                  } ${!formData.clientId ? 'bg-surface-100' : ''}`}
                >
                  <option value="">Choose a strategy...</option>
                  {strategies.map(strategy => (
                    <option key={strategy.Id} value={strategy.Id}>
                      {strategy.name}
                    </option>
                  ))}
                </select>
                {errors.strategyId && (
                  <p className="mt-1 text-sm text-error flex items-center gap-1">
                    <ApperIcon name="AlertCircle" size={16} />
                    {errors.strategyId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Zap" size={20} />
              Campaign Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                label="Campaign Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name}
                required
                icon="Zap"
                placeholder="e.g., Google Ads - New Models"
              />
              
              <div className="relative">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Platform <span className="text-error">*</span>
                </label>
                <select
                  value={formData.platform}
                  onChange={handleInputChange('platform')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary ${
                    errors.platform ? 'border-error' : 'border-surface-300'
                  }`}
                >
                  <option value="">Choose a platform...</option>
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                {errors.platform && (
                  <p className="mt-1 text-sm text-error flex items-center gap-1">
                    <ApperIcon name="AlertCircle" size={16} />
                    {errors.platform}
                  </p>
                )}
              </div>
              
<div className="relative">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Select Budget <span className="text-error">*</span>
                </label>
                <select
                  value={formData.budgetId}
                  onChange={handleInputChange('budgetId')}
                  disabled={!formData.clientId}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary ${
                    errors.budgetId ? 'border-error' : 'border-surface-300'
                  } ${!formData.clientId ? 'bg-surface-100' : ''}`}
                >
                  <option value="">Choose a budget...</option>
                  {budgets.map(budget => (
                    <option key={budget.Id} value={budget.Id}>
                      Budget #{budget.Id} - ${budget.total.toLocaleString()} ({budget.period})
                    </option>
                  ))}
                </select>
                {errors.budgetId && (
                  <p className="mt-1 text-sm text-error flex items-center gap-1">
                    <ApperIcon name="AlertCircle" size={16} />
                    {errors.budgetId}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange('startDate')}
                  error={errors.startDate}
                  required
                  icon="Calendar"
                />
                
                <FormField
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange('endDate')}
                  error={errors.endDate}
                  required
                  icon="Calendar"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-surface-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="Plus"
            >
              Create Campaign
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateCampaign;