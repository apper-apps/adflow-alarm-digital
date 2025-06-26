import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/atoms/StatusBadge';
import SearchBar from '@/components/molecules/SearchBar';
import DataTable from '@/components/molecules/DataTable';
import { formatCurrency } from '@/utils/format';

const ClientsList = ({ clients = [], onCreateClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.dealershipType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Client Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-surface-900">{value}</p>
            <p className="text-sm text-surface-500">{row.dealershipType}</p>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <ApperIcon name="MapPin" size={16} className="text-surface-400" />
          <span className="text-surface-700">{value}</span>
        </div>
      )
    },
    {
      key: 'totalBudget',
      label: 'Monthly Budget',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-surface-900">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon="Eye"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clients/${row.Id}`);
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon="Settings"
            onClick={(e) => {
              e.stopPropagation();
              // Handle settings
            }}
          >
            Settings
          </Button>
        </div>
      )
    }
  ];

  const handleRowClick = (client) => {
    navigate(`/clients/${client.Id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md border border-surface-200"
    >
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-surface-900">Clients</h2>
          <Button icon="Plus" onClick={onCreateClient}>
            New Client
          </Button>
        </div>
        
        <SearchBar
          placeholder="Search clients..."
          onSearch={setSearchTerm}
          className="max-w-md"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredClients}
        onRowClick={handleRowClick}
      />
    </motion.div>
  );
};

export default ClientsList;