import { delay } from '@/utils/delay';
import budgetData from '@/services/mockData/budgets.json';

let budgets = [...budgetData];

const budgetService = {
  async getAll() {
    await delay(300);
    return [...budgets];
  },

  async getById(id) {
    await delay(200);
    const budget = budgets.find(b => b.Id === parseInt(id, 10));
    if (!budget) {
      throw new Error('Budget not found');
    }
    return { ...budget };
  },

  async getByClientId(clientId) {
    await delay(250);
    return budgets.filter(b => b.clientId === parseInt(clientId, 10));
  },

  async create(budgetData) {
    await delay(400);
    const maxId = budgets.length > 0 ? Math.max(...budgets.map(b => b.Id)) : 0;
    const newBudget = {
      Id: maxId + 1,
      ...budgetData,
      createdAt: new Date().toISOString()
    };
    budgets.push(newBudget);
    return { ...newBudget };
  },

  async update(id, data) {
    await delay(300);
    const index = budgets.findIndex(b => b.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Budget not found');
    }
    budgets[index] = { ...budgets[index], ...data };
    return { ...budgets[index] };
  },

  async delete(id) {
    await delay(300);
    const index = budgets.findIndex(b => b.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Budget not found');
    }
    budgets.splice(index, 1);
    return true;
  }
};

export default budgetService;