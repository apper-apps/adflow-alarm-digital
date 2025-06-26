import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import clientService from '@/services/api/clientService';
import budgetService from '@/services/api/budgetService';
import activityService from '@/services/api/activityService';

const CreateBudget = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    total: '',
    period: 'monthly'
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
    
    if (!formData.total || parseFloat(formData.total) <= 0) {
      newErrors.total = 'Please enter a valid budget amount';
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
      const budgetData = {
        clientId: parseInt(formData.clientId, 10),
        total: parseFloat(formData.total),
        period: formData.period,
        allocations: [
          {
            type: 'unallocated',
            amount: parseFloat(formData.total),
            name: 'Unallocated Budget'
          }
        ]
      };
      
      const newBudget = await budgetService.create(budgetData);
      const client = clients.find(c => c.Id === parseInt(formData.clientId, 10));
      
      // Log activity
      await activityService.create({
        userId: 'john.doe@agency.com',
        action: 'Created new budget',
        entityType: 'Budget',
        entityId: newBudget.Id.toString(),
        details: {
          clientName: client?.name,
          totalBudget: newBudget.total,
          period: newBudget.period
        }
      });
      
      toast.success('Budget created successfully!');
      navigate('/budgets');
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Failed to create budget');
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
            onClick={() => navigate('/budgets')}
          >
            Back to Budgets
          </Button>
          <div className="w-px h-8 bg-surface-200"></div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Create New Budget</h1>
            <p className="text-surface-600">Set up a budget allocation for your client</p>
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

          {/* Budget Information */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <ApperIcon name="DollarSign" size={20} />
              Budget Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Total Budget"
                type="number"
                value={formData.total}
                onChange={handleInputChange('total')}
                error={errors.total}
                required
                icon="DollarSign"
                placeholder="Enter total budget amount"
              />
              
              <div className="relative">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Budget Period <span className="text-error">*</span>
                </label>
                <select
                  value={formData.period}
                  onChange={handleInputChange('period')}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ApperIcon name="Info" size={20} className="text-info flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-info mb-1">Budget Allocation</h3>
                <p className="text-sm text-info/80">
                  After creating the budget, you can allocate portions to different strategies and campaigns 
                  through the budget management interface. The entire budget will initially be marked as unallocated.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-surface-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/budgets')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="Plus"
            >
              Create Budget
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateBudget;