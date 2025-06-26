import { delay } from '@/utils/delay';
import clientData from '@/services/mockData/clients.json';

let clients = [...clientData];

const clientService = {
  async getAll() {
    await delay(300);
    return [...clients];
  },

  async getById(id) {
    await delay(200);
    const client = clients.find(c => c.Id === parseInt(id, 10));
    if (!client) {
      throw new Error('Client not found');
    }
    return { ...client };
  },

  async create(clientData) {
    await delay(400);
    const maxId = clients.length > 0 ? Math.max(...clients.map(c => c.Id)) : 0;
    const newClient = {
      Id: maxId + 1,
      ...clientData,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };
    clients.push(newClient);
    return { ...newClient };
  },

  async update(id, data) {
    await delay(300);
    const index = clients.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Client not found');
    }
    clients[index] = { ...clients[index], ...data };
    return { ...clients[index] };
  },

  async delete(id) {
    await delay(300);
    const index = clients.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Client not found');
    }
    clients.splice(index, 1);
    return true;
  }
};

export default clientService;