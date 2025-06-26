import { delay } from '@/utils/delay';
import activityData from '@/services/mockData/activities.json';

let activities = [...activityData];

const activityService = {
  async getAll() {
    await delay(300);
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id, 10));
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(200);
    const maxId = activities.length > 0 ? Math.max(...activities.map(a => a.Id)) : 0;
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    };
    activities.unshift(newActivity);
    return { ...newActivity };
  },

  async getRecent(limit = 10) {
    await delay(250);
    return [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
};

export default activityService;