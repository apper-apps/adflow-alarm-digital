import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import clientService from '@/services/api/clientService';
import campaignService from '@/services/api/campaignService';
import activityService from '@/services/api/activityService';
import DashboardHeader from '@/components/organisms/DashboardHeader';
import ClientsList from '@/components/organisms/ClientsList';
import ActivityFeed from '@/components/organisms/ActivityFeed';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [clientsData, campaignsData, activitiesData] = await Promise.all([
        clientService.getAll(),
        campaignService.getAll(),
        activityService.getRecent(10)
      ]);
      
      setClients(clientsData);
      setCampaigns(campaignsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalBudget = clients.reduce((sum, client) => sum + client.totalBudget, 0);
    const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
    const activeClients = clients.filter(c => c.status === 'Active').length;

    return [
      {
        title: 'Total Budget',
        value: totalBudget,
        format: 'currency',
        icon: 'DollarSign',
        trend: 'up',
        trendValue: '+12%'
      },
      {
        title: 'Total Spent',
        value: totalSpent,
        format: 'currency',
        icon: 'TrendingUp',
        trend: 'up',
        trendValue: '+8%'
      },
      {
        title: 'Active Campaigns',
        value: activeCampaigns,
        icon: 'Zap',
        trend: 'up',
        trendValue: '+3'
      },
      {
        title: 'Active Clients',
        value: activeClients,
        icon: 'Users',
        trend: 'neutral',
        trendValue: 'Stable'
      }
    ];
  };

  const handleCreateClient = () => {
    navigate('/clients/create');
  };

  const handleCreateCampaign = () => {
    navigate('/campaigns/create');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  const metrics = calculateMetrics();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <DashboardHeader
        metrics={metrics}
        onCreateClient={handleCreateClient}
        onCreateCampaign={handleCreateCampaign}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClientsList
            clients={clients}
            onCreateClient={handleCreateClient}
          />
        </div>
        
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;