import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/atoms/StatusBadge';
import DataTable from '@/components/molecules/DataTable';
import clientService from '@/services/api/clientService';
import ClientsList from '@/components/organisms/ClientsList';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { formatCurrency } from '@/utils/format';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError(err.message || 'Failed to load clients');
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

const handleCreateClient = () => {
    navigate('/clients/create');
  };

  const tableColumns = [
    {
      key: 'name',
      label: 'Client Name',
      sortable: true,
      render: (value) => (
        <div className="font-semibold text-surface-900">{value}</div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true
    },
    {
      key: 'totalBudget',
      label: 'Monthly Budget',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-surface-900">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, client) => (
        <Button
          variant="ghost"
          size="sm"
          icon="Eye"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/clients/${client.Id}`);
          }}
        >
          View
        </Button>
      )
    }
  ];

  const handleRowClick = (client) => {
    navigate(`/clients/${client.Id}`);
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
          onRetry={loadClients}
        />
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="Building2"
          title="No clients found"
          description="Get started by adding your first client to manage their campaigns and budgets."
          actionLabel="Add Client"
          onAction={handleCreateClient}
        />
      </div>
    );
  }

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="bg-white rounded-lg shadow-md border border-surface-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
              <ApperIcon name="Building2" size={24} />
              Clients
            </h1>
            <p className="text-surface-600">Manage your client accounts and relationships</p>
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
            <Button icon="Plus" onClick={handleCreateClient}>
              Add Client
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <ClientsList
          clients={clients}
          onCreateClient={handleCreateClient}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-surface-200">
          <DataTable
            columns={tableColumns}
            data={clients}
            onRowClick={handleRowClick}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Clients;