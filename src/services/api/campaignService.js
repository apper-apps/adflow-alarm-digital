import { delay } from '@/utils/delay';
import campaignData from '@/services/mockData/campaigns.json';

let campaigns = [...campaignData];

const campaignService = {
  async getAll() {
    await delay(300);
    return [...campaigns];
  },

  async getById(id) {
    await delay(200);
    const campaign = campaigns.find(c => c.Id === parseInt(id, 10));
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return { ...campaign };
  },

  async getByStrategyId(strategyId) {
    await delay(250);
    return campaigns.filter(c => c.strategyId === parseInt(strategyId, 10));
  },

  async create(campaignData) {
    await delay(400);
    const maxId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.Id)) : 0;
    const newCampaign = {
      Id: maxId + 1,
      ...campaignData,
      spent: 0,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    campaigns.push(newCampaign);
    return { ...newCampaign };
  },

  async update(id, data) {
    await delay(300);
    const index = campaigns.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    campaigns[index] = { ...campaigns[index], ...data };
    return { ...campaigns[index] };
  },

  async delete(id) {
    await delay(300);
    const index = campaigns.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    campaigns.splice(index, 1);
    return true;
  }
};

export default campaignService;