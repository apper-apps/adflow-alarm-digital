import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import clientService from '@/services/api/clientService';
import ClientsList from '@/components/organisms/ClientsList';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      <ClientsList
        clients={clients}
        onCreateClient={handleCreateClient}
      />
    </motion.div>
  );
};

export default Clients;