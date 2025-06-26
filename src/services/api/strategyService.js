import { delay } from '@/utils/delay';
import strategyData from '@/services/mockData/strategies.json';

let strategies = [...strategyData];

const strategyService = {
  async getAll() {
    await delay(300);
    return [...strategies];
  },

  async getById(id) {
    await delay(200);
    const strategy = strategies.find(s => s.Id === parseInt(id, 10));
    if (!strategy) {
      throw new Error('Strategy not found');
    }
    return { ...strategy };
  },

  async getByClientId(clientId) {
    await delay(250);
    return strategies.filter(s => s.clientId === parseInt(clientId, 10));
  },

  async create(strategyData) {
    await delay(400);
    const maxId = strategies.length > 0 ? Math.max(...strategies.map(s => s.Id)) : 0;
    const newStrategy = {
      Id: maxId + 1,
      ...strategyData,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    strategies.push(newStrategy);
    return { ...newStrategy };
  },

  async update(id, data) {
    await delay(300);
    const index = strategies.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Strategy not found');
    }
    strategies[index] = { ...strategies[index], ...data };
    return { ...strategies[index] };
  },

  async delete(id) {
    await delay(300);
    const index = strategies.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Strategy not found');
    }
    strategies.splice(index, 1);
    return true;
  }
};

export default strategyService;