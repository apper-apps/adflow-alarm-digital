import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import BudgetFlowCard from '@/components/molecules/BudgetFlowCard';
import DataTable from '@/components/molecules/DataTable';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import budgetService from '@/services/api/budgetService';
import clientService from '@/services/api/clientService';
import { formatCurrency } from '@/utils/format';

const Budgets = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  useEffect(() => {
    loadBudgetsData();
  }, []);

  const loadBudgetsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [budgetsData, clientsData] = await Promise.all([
        budgetService.getAll(),
        clientService.getAll()
      ]);
      
      setBudgets(budgetsData);
      setClients(clientsData);
    } catch (err) {
      setError(err.message || 'Failed to load budgets data');
      toast.error('Failed to load budgets data');
    } finally {
      setLoading(false);
    }
  };

const handleCreateBudget = () => {
    navigate('/budgets/create');
  };

  const tableColumns = [
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      render: (_, budget) => (
        <div className="font-semibold text-surface-900">
          {budget.client?.name || 'Unknown Client'}
        </div>
      )
    },
    {
      key: 'total',
      label: 'Total Budget',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-surface-900">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'allocated',
      label: 'Allocated',
      sortable: true,
      render: (_, budget) => {
        const allocated = budget.allocations.reduce((sum, alloc) => 
          alloc.type !== 'unallocated' ? sum + alloc.amount : sum, 0
        );
        return (
          <span className="font-medium text-success">
            {formatCurrency(allocated)}
          </span>
        );
      }
    },
    {
      key: 'remaining',
      label: 'Remaining',
      sortable: true,
      render: (_, budget) => {
        const allocated = budget.allocations.reduce((sum, alloc) => 
          alloc.type !== 'unallocated' ? sum + alloc.amount : sum, 0
        );
        const remaining = budget.total - allocated;
        return (
          <span className={`font-medium ${remaining > 0 ? 'text-surface-900' : 'text-error'}`}>
            {formatCurrency(remaining)}
          </span>
        );
      }
    },
    {
      key: 'utilization',
      label: 'Utilization',
      sortable: true,
      render: (_, budget) => {
        const allocated = budget.allocations.reduce((sum, alloc) => 
          alloc.type !== 'unallocated' ? sum + alloc.amount : sum, 0
        );
        const utilization = budget.total > 0 ? (allocated / budget.total) * 100 : 0;
        return (
          <span className={`font-medium ${
            utilization >= 90 ? 'text-error' : 
            utilization >= 75 ? 'text-warning' : 'text-success'
          }`}>
            {Math.round(utilization)}%
          </span>
        );
      }
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadBudgetsData}
        />
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="DollarSign"
          title="No budgets found"
          description="Create budget allocations for your clients to manage their campaign spending."
          actionLabel="Create Budget"
          onAction={handleCreateBudget}
        />
      </div>
    );
  }

  const budgetsWithClients = budgets.map(budget => {
    const client = clients.find(c => c.Id === budget.clientId);
    return { ...budget, client };
  });

  const totalBudgets = budgets.reduce((sum, budget) => sum + budget.total, 0);
  const totalAllocated = budgets.reduce((sum, budget) => 
    sum + budget.allocations.reduce((allocSum, alloc) => 
      alloc.type !== 'unallocated' ? allocSum + alloc.amount : allocSum, 0
    ), 0
  );

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
              <ApperIcon name="DollarSign" size={24} />
              Budget Management
            </h1>
            <p className="text-surface-600">Manage and allocate budgets across all client accounts</p>
          </div>
          <div className="flex items-center gap-3">
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
            <Button icon="Plus" onClick={handleCreateBudget}>
              Create Budget
            </Button>
          </div>
        </div>

        {viewMode === 'cards' && (
          <>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-50 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Wallet" size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-surface-900">{formatCurrency(totalBudgets)}</h3>
            <p className="text-sm text-surface-600">Total Budgets</p>
          </div>
          
          <div className="bg-surface-50 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="TrendingUp" size={24} className="text-success" />
            </div>
            <h3 className="font-semibold text-surface-900">{formatCurrency(totalAllocated)}</h3>
            <p className="text-sm text-surface-600">Total Allocated</p>
          </div>
          
          <div className="bg-surface-50 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="PieChart" size={24} className="text-warning" />
            </div>
            <h3 className="font-semibold text-surface-900">{budgets.length}</h3>
            <p className="text-sm text-surface-600">Active Budgets</p>
          </div>
        </div>
</>
        )}
      </div>

      {viewMode === 'cards' ? (
        /* Budget Cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgetsWithClients.map((budget, index) => {
            const allocated = budget.allocations.reduce((sum, alloc) => 
              alloc.type !== 'unallocated' ? sum + alloc.amount : sum, 0
            );
            const spent = 0; // In a real app, this would come from actual campaign spend data

            return (
              <motion.div
                key={budget.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BudgetFlowCard
                  title={budget.client?.name || 'Unknown Client'}
                  total={budget.total}
                  allocated={allocated}
                  spent={spent}
                  allocations={budget.allocations}
                />
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Budget Table */
        <div className="bg-white rounded-lg shadow-md border border-surface-200">
          <DataTable
            columns={tableColumns}
            data={budgetsWithClients}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Budgets;