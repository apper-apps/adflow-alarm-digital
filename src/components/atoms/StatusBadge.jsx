const StatusBadge = ({ status, variant = 'default' }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'paused':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completed':
        return 'bg-surface-500/10 text-surface-600 border-surface-500/20';
      case 'draft':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-surface-100 text-surface-600 border-surface-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;