import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import clientService from '@/services/api/clientService';
import strategyService from '@/services/api/strategyService';
import activityService from '@/services/api/activityService';

const CreateStrategy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: location.state?.clientId || '',
    name: '',
    goal: '',
    allocatedBudget: '',
    targetAudience: '',
    kpi: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data.filter(c => c.status === 'Active'));
    } catch (error) {
      toast.error('Failed to load clients');
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Strategy name is required';
    }
    
    if (!formData.goal.trim()) {
      newErrors.goal = 'Strategy goal is required';
    }
    
    if (!formData.allocatedBudget || parseFloat(formData.allocatedBudget) <= 0) {
      newErrors.allocatedBudget = 'Please enter a valid budget amount';
    }
    
    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }
    
    if (!formData.kpi.trim()) {
      newErrors.kpi = 'Key performance indicator is required';
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
      const strategyData = {
        clientId: parseInt(formData.clientId, 10),
        name: formData.name.trim(),
        goal: formData.goal.trim(),
        allocatedBudget: parseFloat(formData.allocatedBudget),
        targetAudience: formData.targetAudience.trim(),
        kpi: formData.kpi.trim()
      };
      
      const newStrategy = await strategyService.create(strategyData);
      const client = clients.find(c => c.Id === parseInt(formData.clientId, 10));
      
      // Log activity
      await activityService.create({
        userId: 'john.doe@agency.com',
        action: 'Created new strategy',
        entityType: 'Strategy',
        entityId: newStrategy.Id.toString(),
        details: {
          strategyName: newStrategy.name,
          clientName: client?.name,
          allocatedBudget: newStrategy.allocatedBudget
        }
      });
      
      toast.success('Strategy created successfully!');
      navigate(`/clients/${formData.clientId}`);
    } catch (error) {
      console.error('Error creating strategy:', error);
      toast.error('Failed to create strategy');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-surface-900">Create New Strategy</h1>
            <p className="text-surface-600">Define a high-level campaign strategy for your client</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Users" size={20} />
              Client Selection
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
            </div>
          </div>

          {/* Strategy Information */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Target" size={20} />
              Strategy Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                label="Strategy Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name}
                required
                icon="Target"
                placeholder="e.g., New Vehicle Launch Campaign"
              />
              
              <div className="relative">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Strategy Goal <span className="text-error">*</span>
                </label>
                <textarea
                  value={formData.goal}
                  onChange={handleInputChange('goal')}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary ${
                    errors.goal ? 'border-error' : 'border-surface-300'
                  }`}
                  placeholder="Describe the high-level goal for this strategy..."
                />
                {errors.goal && (
                  <p className="mt-1 text-sm text-error flex items-center gap-1">
                    <ApperIcon name="AlertCircle" size={16} />
                    {errors.goal}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Allocated Budget"
                  type="number"
                  value={formData.allocatedBudget}
                  onChange={handleInputChange('allocatedBudget')}
                  error={errors.allocatedBudget}
                  required
                  icon="DollarSign"
                  placeholder="Enter budget amount"
                />
                
                <FormField
                  label="Target Audience"
                  value={formData.targetAudience}
                  onChange={handleInputChange('targetAudience')}
                  error={errors.targetAudience}
                  required
                  icon="Users"
                  placeholder="e.g., Luxury car buyers aged 35-55"
                />
              </div>
              
              <FormField
                label="Key Performance Indicator"
                value={formData.kpi}
                onChange={handleInputChange('kpi')}
                error={errors.kpi}
                required
                icon="TrendingUp"
                placeholder="e.g., Test drive bookings, Lead generation"
              />
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
              Create Strategy
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateStrategy;