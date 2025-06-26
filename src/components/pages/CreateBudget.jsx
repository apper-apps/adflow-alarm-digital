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
  const [segments, setSegments] = useState([]);
  const [editingSegment, setEditingSegment] = useState(null);
  const [showAddSegment, setShowAddSegment] = useState(false);
  const [segmentForm, setSegmentForm] = useState({ name: '', amount: '' });
  const [errors, setErrors] = useState({});
  
  const totalAllocated = segments.reduce((sum, segment) => sum + parseFloat(segment.amount || 0), 0);
  const remainingBudget = parseFloat(formData.total || 0) - totalAllocated;

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
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear segment errors when budget changes
    if (field === 'total' && errors.segments) {
      setErrors(prev => ({ ...prev, segments: '' }));
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
    
    // Validate segments
    const totalBudget = parseFloat(formData.total || 0);
    if (segments.length > 0) {
      const hasInvalidSegments = segments.some(segment => 
        !segment.name.trim() || !segment.amount || parseFloat(segment.amount) <= 0
      );
      
      if (hasInvalidSegments) {
        newErrors.segments = 'All segments must have valid names and amounts';
      } else if (totalAllocated > totalBudget) {
        newErrors.segments = `Total segment allocation (${totalAllocated}) exceeds budget (${totalBudget})`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddSegment = () => {
    if (!segmentForm.name.trim() || !segmentForm.amount || parseFloat(segmentForm.amount) <= 0) {
      toast.error('Please enter valid segment name and amount');
      return;
    }
    
    const amount = parseFloat(segmentForm.amount);
    if (totalAllocated + amount > parseFloat(formData.total || 0)) {
      toast.error('Segment amount would exceed remaining budget');
      return;
    }
    
    const newSegment = {
      id: Date.now(),
      name: segmentForm.name.trim(),
      amount: amount
    };
    
    setSegments(prev => [...prev, newSegment]);
    setSegmentForm({ name: '', amount: '' });
    setShowAddSegment(false);
  };
  
  const handleEditSegment = (segment) => {
    setEditingSegment(segment.id);
    setSegmentForm({ name: segment.name, amount: segment.amount.toString() });
  };
  
  const handleUpdateSegment = () => {
    if (!segmentForm.name.trim() || !segmentForm.amount || parseFloat(segmentForm.amount) <= 0) {
      toast.error('Please enter valid segment name and amount');
      return;
    }
    
    const amount = parseFloat(segmentForm.amount);
    const currentSegmentAmount = segments.find(s => s.id === editingSegment)?.amount || 0;
    const otherSegmentsTotal = totalAllocated - currentSegmentAmount;
    
    if (otherSegmentsTotal + amount > parseFloat(formData.total || 0)) {
      toast.error('Segment amount would exceed remaining budget');
      return;
    }
    
    setSegments(prev => prev.map(segment => 
      segment.id === editingSegment 
        ? { ...segment, name: segmentForm.name.trim(), amount: amount }
        : segment
    ));
    
    setEditingSegment(null);
    setSegmentForm({ name: '', amount: '' });
  };
  
  const handleDeleteSegment = (segmentId) => {
    setSegments(prev => prev.filter(segment => segment.id !== segmentId));
    if (editingSegment === segmentId) {
      setEditingSegment(null);
      setSegmentForm({ name: '', amount: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
const totalBudget = parseFloat(formData.total);
      const allocations = [
        ...segments.map(segment => ({
          type: 'segment',
          amount: segment.amount,
          name: segment.name
        }))
      ];
      
      // Add unallocated amount if there's remaining budget
      const unallocatedAmount = totalBudget - totalAllocated;
      if (unallocatedAmount > 0) {
        allocations.push({
          type: 'unallocated',
          amount: unallocatedAmount,
          name: 'Unallocated Budget'
        });
      }
      
      const budgetData = {
        clientId: parseInt(formData.clientId, 10),
        total: totalBudget,
        period: formData.period,
        allocations: allocations
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

          {/* Budget Segments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900 flex items-center gap-2">
                <ApperIcon name="PieChart" size={20} />
                Budget Segments
              </h2>
              <Button
                type="button"
                variant="outline"
                icon="Plus"
                onClick={() => setShowAddSegment(true)}
                disabled={!formData.total || parseFloat(formData.total) <= 0}
              >
                Add Segment
              </Button>
            </div>

            {/* Budget Overview */}
            {formData.total && parseFloat(formData.total) > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-surface-50 rounded-lg">
                  <p className="text-sm text-surface-600">Total Budget</p>
                  <p className="text-lg font-bold text-surface-900">${parseFloat(formData.total).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-sm text-surface-600">Allocated</p>
                  <p className="text-lg font-bold text-success">${totalAllocated.toLocaleString()}</p>
                </div>
                <div className={`text-center p-3 rounded-lg ${remainingBudget >= 0 ? 'bg-info/10' : 'bg-error/10'}`}>
                  <p className="text-sm text-surface-600">Remaining</p>
                  <p className={`text-lg font-bold ${remainingBudget >= 0 ? 'text-info' : 'text-error'}`}>
                    ${Math.abs(remainingBudget).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Segments List */}
            {segments.length > 0 && (
              <div className="space-y-3 mb-4">
                {segments.map((segment) => (
                  <div key={segment.id} className="flex items-center justify-between p-4 bg-white border border-surface-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <div>
                        <h4 className="font-medium text-surface-900">{segment.name}</h4>
                        <p className="text-sm text-surface-600">${segment.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon="Edit2"
                        onClick={() => handleEditSegment(segment)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteSegment(segment.id)}
                        className="text-error hover:text-error"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Segment Form */}
            {(showAddSegment || editingSegment) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-surface-50 border border-surface-200 rounded-lg mb-4"
              >
                <h4 className="font-medium text-surface-900 mb-3">
                  {editingSegment ? 'Edit Segment' : 'Add New Segment'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Segment Name"
                    type="text"
                    value={segmentForm.name}
                    onChange={(e) => setSegmentForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Social Media, Search Ads"
                    required
                  />
                  <FormField
                    label="Amount"
                    type="number"
                    value={segmentForm.amount}
                    onChange={(e) => setSegmentForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    required
                    icon="DollarSign"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
setShowAddSegment(false);
                      setEditingSegment(null);
                      setSegmentForm({ name: '', amount: '', campaignId: '', strategyId: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    icon={editingSegment ? "Save" : "Plus"}
                    onClick={editingSegment ? handleUpdateSegment : handleAddSegment}
                  >
                    {editingSegment ? 'Update Segment' : 'Add Segment'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Validation Error */}
            {errors.segments && (
              <div className="flex items-center gap-2 text-error text-sm mt-2">
                <ApperIcon name="AlertCircle" size={16} />
                {errors.segments}
              </div>
            )}

            {segments.length === 0 && (
              <div className="text-center py-8 text-surface-500">
                <ApperIcon name="PieChart" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No segments added yet</p>
                <p className="text-sm">Add segments to divide your budget into specific allocations</p>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ApperIcon name="Info" size={20} className="text-info flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-info mb-1">Budget Segments</h3>
                <p className="text-sm text-info/80">
                  Create budget segments to pre-allocate portions of your budget to specific areas like social media, 
                  search ads, or creative campaigns. Any unallocated amount will be available for future strategies.
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