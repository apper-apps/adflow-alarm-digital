import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import clientService from '@/services/api/clientService';
import activityService from '@/services/api/activityService';

const CreateClient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    totalBudget: '',
    budgetPeriod: 'monthly',
    dealershipType: '',
    location: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    if (!formData.totalBudget || parseFloat(formData.totalBudget) <= 0) {
      newErrors.totalBudget = 'Please enter a valid budget amount';
    }
    
    if (!formData.dealershipType.trim()) {
      newErrors.dealershipType = 'Dealership type is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
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
      const clientData = {
        name: formData.name.trim(),
        totalBudget: parseFloat(formData.totalBudget),
        budgetPeriod: formData.budgetPeriod,
        dealershipType: formData.dealershipType.trim(),
        location: formData.location.trim(),
        contact: {
          name: formData.contactName.trim(),
          email: formData.contactEmail.trim(),
          phone: formData.contactPhone.trim()
        }
      };
      
      const newClient = await clientService.create(clientData);
      
      // Log activity
      await activityService.create({
        userId: 'john.doe@agency.com',
        action: 'Created new client',
        entityType: 'Client',
        entityId: newClient.Id.toString(),
        details: {
          clientName: newClient.name,
          totalBudget: newClient.totalBudget,
          location: newClient.location
        }
      });
      
      toast.success('Client created successfully!');
      navigate('/clients');
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
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
            onClick={() => navigate('/clients')}
          >
            Back to Clients
          </Button>
          <div className="w-px h-8 bg-surface-200"></div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Create New Client</h1>
            <p className="text-surface-600">Add a new car dealership client to manage their campaigns</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Building2" size={20} />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Client Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name}
                required
                icon="Building2"
                placeholder="Enter client name"
              />
              
              <FormField
                label="Dealership Type"
                value={formData.dealershipType}
                onChange={handleInputChange('dealershipType')}
                error={errors.dealershipType}
                required
                icon="Car"
                placeholder="e.g., Ford, Honda, Multi-brand"
              />
              
              <FormField
                label="Location"
                value={formData.location}
                onChange={handleInputChange('location')}
                error={errors.location}
                required
                icon="MapPin"
                placeholder="City, State"
              />
            </div>
          </div>

          {/* Budget Information */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <ApperIcon name="DollarSign" size={20} />
              Budget Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Total Budget"
                type="number"
                value={formData.totalBudget}
                onChange={handleInputChange('totalBudget')}
                error={errors.totalBudget}
                required
                icon="DollarSign"
                placeholder="Enter budget amount"
              />
              
              <div className="relative">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Budget Period <span className="text-error">*</span>
                </label>
                <select
                  value={formData.budgetPeriod}
                  onChange={handleInputChange('budgetPeriod')}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <ApperIcon name="User" size={20} />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Contact Name"
                value={formData.contactName}
                onChange={handleInputChange('contactName')}
                error={errors.contactName}
                required
                icon="User"
                placeholder="Primary contact name"
              />
              
              <FormField
                label="Email Address"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange('contactEmail')}
                error={errors.contactEmail}
                required
                icon="Mail"
                placeholder="contact@dealership.com"
              />
              
              <FormField
                label="Phone Number"
                type="tel"
                value={formData.contactPhone}
                onChange={handleInputChange('contactPhone')}
                error={errors.contactPhone}
                required
                icon="Phone"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-surface-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/clients')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="Plus"
            >
              Create Client
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateClient;