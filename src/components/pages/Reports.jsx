import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperChart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import MetricCard from '@/components/atoms/MetricCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import clientService from '@/services/api/clientService';
import campaignService from '@/services/api/campaignService';
import { formatCurrency } from '@/utils/format';

const Reports = () => {
  const [clients, setClients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
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
      setError(err.message || 'Failed to load reports data');
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    const budgetData = clients.map(client => ({
      name: client.name,
      budget: client.totalBudget
    }));

    const spendData = clients.map(client => {
      const clientCampaigns = campaigns.filter(campaign => 
        campaign.status === 'Active' // In a real app, you'd have proper client-campaign relationships
      );
      const spent = clientCampaigns.reduce((sum, c) => sum + c.spent, 0);
      return {
        name: client.name,
        spent: spent / clients.length // Distribute evenly for demo
      };
    });

    return {
      budgetChart: {
        series: [{
          name: 'Budget',
          data: budgetData.map(d => d.budget)
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: budgetData.map(d => d.name)
          },
          colors: ['#1B2951'],
          grid: {
            borderColor: '#f1f5f9'
          }
        }
      },
      spendChart: {
        series: spendData.map(d => d.spent),
        options: {
          chart: {
            type: 'donut',
            height: 350
          },
          labels: spendData.map(d => d.name),
          colors: ['#1B2951', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
          legend: {
            position: 'bottom'
          }
        }
      }
    };
  };

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
          onRetry={loadReportsData}
        />
      </div>
    );
  }

  const totalBudget = clients.reduce((sum, client) => sum + client.totalBudget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + (campaign.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + (campaign.clicks || 0), 0);

  const reportMetrics = [
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
      title: 'Total Impressions',
      value: totalImpressions,
      icon: 'Eye',
      trend: 'up',
      trendValue: '+15%'
    },
    {
      title: 'Total Clicks',
      value: totalClicks,
      icon: 'MousePointer',
      trend: 'up',
      trendValue: '+10%'
    }
  ];

  const chartData = generateChartData();

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
              <ApperIcon name="BarChart3" size={24} />
              Reports & Analytics
            </h1>
            <p className="text-surface-600">Comprehensive performance analytics across all campaigns</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            
            <Button icon="Download">
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportMetrics.map((metric, index) => (
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Distribution */}
        <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Budget Distribution by Client</h2>
          <ApperChart
            options={chartData.budgetChart.options}
            series={chartData.budgetChart.series}
            type="bar"
            height={350}
          />
        </div>

        {/* Spend Distribution */}
        <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Spend Distribution</h2>
          <ApperChart
            options={chartData.spendChart.options}
            series={chartData.spendChart.series}
            type="donut"
            height={350}
          />
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-lg shadow-md border border-surface-200">
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold text-surface-900">Campaign Performance</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  CTR
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {campaigns.map((campaign, index) => {
                const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions * 100).toFixed(2) : '0.00';
                
                return (
                  <motion.tr
                    key={campaign.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-surface-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                        {campaign.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {formatCurrency(campaign.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {formatCurrency(campaign.spent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {campaign.impressions?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {campaign.clicks?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {ctr}%
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;