import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ActivityFeed from '@/components/organisms/ActivityFeed';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import activityService from '@/services/api/activityService';
import { formatDateTime } from '@/utils/format';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await activityService.getAll();
      setActivities(data);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    if (filter === 'all') return activities;
    return activities.filter(activity => 
      activity.entityType.toLowerCase() === filter.toLowerCase()
    );
  };

  const getActivityStats = () => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayActivities = activities.filter(activity => 
      new Date(activity.timestamp) >= todayStart
    );
    
    const campaigns = activities.filter(a => a.entityType === 'Campaign').length;
    const strategies = activities.filter(a => a.entityType === 'Strategy').length;
    const clients = activities.filter(a => a.entityType === 'Client').length;
    
    return {
      today: todayActivities.length,
      total: activities.length,
      campaigns,
      strategies,
      clients
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadActivities}
        />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="Activity"
          title="No activity yet"
          description="Activity will appear here as you create clients, strategies, and campaigns."
        />
      </div>
    );
  }

  const filteredActivities = filterActivities();
  const stats = getActivityStats();

  const filters = [
    { value: 'all', label: 'All Activity', count: activities.length },
    { value: 'client', label: 'Clients', count: stats.clients },
    { value: 'strategy', label: 'Strategies', count: stats.strategies },
    { value: 'campaign', label: 'Campaigns', count: stats.campaigns }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
              <ApperIcon name="Activity" size={24} />
              Activity Log
            </h1>
            <p className="text-surface-600">Track all platform activity and changes</p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-50 rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Clock" size={20} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-surface-900">{stats.today}</h3>
            <p className="text-sm text-surface-600">Today's Activity</p>
          </div>
          
          <div className="bg-surface-50 rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Activity" size={20} className="text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-surface-900">{stats.total}</h3>
            <p className="text-sm text-surface-600">Total Actions</p>
          </div>
          
          <div className="bg-surface-50 rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Zap" size={20} className="text-accent" />
            </div>
            <h3 className="text-xl font-bold text-surface-900">{stats.campaigns}</h3>
            <p className="text-sm text-surface-600">Campaign Actions</p>
          </div>
          
          <div className="bg-surface-50 rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Users" size={20} className="text-warning" />
            </div>
            <h3 className="text-xl font-bold text-surface-900">{stats.clients}</h3>
            <p className="text-sm text-surface-600">Client Actions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={filteredActivities} />
    </motion.div>
  );
};

export default Activity;