import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { formatCurrency, formatPercentage } from "@/utils/format";
import clientService from "@/services/api/clientService";
import campaignService from "@/services/api/campaignService";
import ApperIcon from "@/components/ApperIcon";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import DataTable from "@/components/molecules/DataTable";
import ErrorState from "@/components/molecules/ErrorState";
import MetricCard from "@/components/atoms/MetricCard";
import ProgressBar from "@/components/atoms/ProgressBar";

const Pacing = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards');

  useEffect(() => {
    loadPacingData();
  }, []);

  const loadPacingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [clientsData, campaignsData] = await Promise.all([
        clientService.getAll(),
        campaignService.getAll()
      ]);
      
      setClients(clientsData);
      setCampaigns(campaignsData);
    } catch (err) {
      setError(err.message || 'Failed to load pacing data');
      toast.error('Failed to load pacing data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePacingData = () => {
    return clients.map(client => {
      const clientCampaigns = campaigns.filter(campaign => {
        // For now, we'll consider all campaigns as belonging to clients
        // In a real app, you'd have proper relationship mapping
        return campaign.status === 'Active';
      });

      const totalBudget = clientCampaigns.reduce((sum, c) => sum + c.budget, 0);
      const totalSpent = clientCampaigns.reduce((sum, c) => sum + c.spent, 0);
      const spendRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      return {
        ...client,
        totalBudget,
        totalSpent,
        spendRate,
        remaining: totalBudget - totalSpent,
        campaignCount: clientCampaigns.length
      };
    });
};

  const campaignTableColumns = [
    {
      key: 'name',
      label: 'Campaign',
      sortable: true,
      render: (value) => (
        <div className="font-semibold text-surface-900">{value}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-success/10 text-success' :
          value === 'Paused' ? 'bg-warning/10 text-warning' :
          'bg-error/10 text-error'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-surface-900">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'spent',
      label: 'Spent',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-surface-900">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'remaining',
      label: 'Remaining',
      sortable: true,
      render: (_, campaign) => {
        const remaining = campaign.budget - campaign.spent;
        return (
          <span className={`font-medium ${remaining > 0 ? 'text-surface-900' : 'text-error'}`}>
            {formatCurrency(remaining)}
          </span>
        );
      }
    },
    {
      key: 'spendRate',
      label: 'Spend Rate',
      sortable: true,
      render: (_, campaign) => {
        const spendRate = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
        return (
          <span className={`font-medium ${
            spendRate >= 90 ? 'text-error' : 
            spendRate >= 75 ? 'text-warning' : 'text-success'
          }`}>
            {Math.round(spendRate)}%
          </span>
        );
      }
    }
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
          onRetry={loadPacingData}
        />
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="TrendingUp"
          title="No pacing data available"
          description="Add clients and campaigns to start tracking budget pacing and spend rates."
          actionLabel="View Clients"
          onAction={() => navigate('/clients')}
        />
      </div>
    );
  }

  const pacingData = calculatePacingData();
  const totalBudget = pacingData.reduce((sum, client) => sum + client.totalBudget, 0);
  const totalSpent = pacingData.reduce((sum, client) => sum + client.totalSpent, 0);
  const avgSpendRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const overallMetrics = [
    {
      title: 'Total Budget',
      value: totalBudget,
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
      title: 'Average Spend Rate',
      value: Math.round(avgSpendRate),
      format: 'percentage',
      icon: 'Percent'
    },
    {
      title: 'Remaining Budget',
      value: totalBudget - totalSpent,
      format: 'currency',
      icon: 'Wallet'
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={24} />
              Budget Pacing
            </h1>
            <p className="text-surface-600">Monitor budget utilization and spending patterns across all clients</p>
          </div>
          <div className="flex bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="LayoutGrid" size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="Table" size={16} />
            </button>
          </div>
        </div>

        {/* Overall Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overallMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
</div>
      </div>

      {viewMode === 'cards' ? (
        /* Client Pacing Details */
        <div className="bg-white rounded-lg shadow-md border border-surface-200">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Client Budget Pacing</h2>
            <p className="text-surface-600 mt-1">Individual client spend rates and budget utilization</p>
          </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pacingData.map((client, index) => (
              <motion.div
                key={client.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface-50 rounded-lg p-6 border border-surface-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building2" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">{client.name}</h3>
                      <p className="text-sm text-surface-600">{client.campaignCount} active campaigns</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-surface-600">Spend Rate</p>
                    <p className={`font-bold ${
                      client.spendRate >= 90 ? 'text-error' : 
                      client.spendRate >= 75 ? 'text-warning' : 'text-success'
                    }`}>
                      {Math.round(client.spendRate)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ProgressBar
                    value={client.totalSpent}
                    max={client.totalBudget}
                    showPercentage={false}
                  />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-surface-600">Total Budget</p>
                      <p className="font-semibold text-surface-900">{formatCurrency(client.totalBudget)}</p>
                    </div>
                    <div>
                      <p className="text-surface-600">Spent</p>
                      <p className="font-semibold text-surface-900">{formatCurrency(client.totalSpent)}</p>
                    </div>
                    <div>
                      <p className="text-surface-600">Remaining</p>
                      <p className="font-semibold text-surface-900">{formatCurrency(client.remaining)}</p>
                    </div>
                    <div>
                      <p className="text-surface-600">Utilization</p>
                      <p className={`font-semibold ${
                        client.spendRate >= 90 ? 'text-error' : 
                        client.spendRate >= 75 ? 'text-warning' : 'text-success'
                      }`}>
                        {formatPercentage(client.totalSpent, client.totalBudget)}
                      </p>
</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      ) : (
        /* Campaign Pacing Table */
        <div className="bg-white rounded-lg shadow-md border border-surface-200">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Campaign Pacing Details</h2>
            <p className="text-surface-600 mt-1">Detailed campaign spend and pacing information</p>
          </div>
          <DataTable
            columns={campaignTableColumns}
            data={campaigns.filter(campaign => campaign.status === 'Active')}
          />
        </div>
      )}
    </motion.div>
};

export default Pacing;