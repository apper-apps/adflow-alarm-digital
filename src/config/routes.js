import Dashboard from '@/components/pages/Dashboard';
import Clients from '@/components/pages/Clients';
import ClientDetail from '@/components/pages/ClientDetail';
import Pacing from '@/components/pages/Pacing';
import Budgets from '@/components/pages/Budgets';
import Manage from '@/components/pages/Manage';
import Reports from '@/components/pages/Reports';
import Activity from '@/components/pages/Activity';
import CreateClient from '@/components/pages/CreateClient';
import CreateStrategy from '@/components/pages/CreateStrategy';
import CreateCampaign from '@/components/pages/CreateCampaign';
import CreateBudget from '@/components/pages/CreateBudget';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  clients: {
    id: 'clients',
    label: 'Clients',
    path: '/clients',
    icon: 'Users',
    component: Clients
  },
  clientDetail: {
    id: 'clientDetail',
    label: 'Client Detail',
    path: '/clients/:id',
    icon: 'User',
    component: ClientDetail,
    hidden: true
  },
  pacing: {
    id: 'pacing',
    label: 'Pacing',
    path: '/pacing',
    icon: 'TrendingUp',
    component: Pacing
  },
  budgets: {
    id: 'budgets',
    label: 'Budgets',
    path: '/budgets',
    icon: 'DollarSign',
    component: Budgets
  },
  manage: {
    id: 'manage',
    label: 'Manage',
    path: '/manage',
    icon: 'Settings',
    component: Manage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  activity: {
    id: 'activity',
    label: 'Activity',
    path: '/activity',
    icon: 'Activity',
    component: Activity
  },
  createClient: {
    id: 'createClient',
    label: 'Create Client',
    path: '/clients/create',
    icon: 'Plus',
    component: CreateClient,
    hidden: true
  },
  createStrategy: {
    id: 'createStrategy',
    label: 'Create Strategy',
    path: '/strategies/create',
    icon: 'Plus',
    component: CreateStrategy,
    hidden: true
  },
  createCampaign: {
    id: 'createCampaign',
    label: 'Create Campaign',
    path: '/campaigns/create',
    icon: 'Plus',
    component: CreateCampaign,
    hidden: true
  },
  createBudget: {
    id: 'createBudget',
    label: 'Create Budget',
    path: '/budgets/create',
    icon: 'Plus',
    component: CreateBudget,
    hidden: true
  }
};

export const routeArray = Object.values(routes);