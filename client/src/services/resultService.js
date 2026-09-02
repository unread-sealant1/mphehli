import { fixtureService } from './fixtureService';
import { getResult } from '../utils/fixtureUtils';

export const resultService = {
  getResults: async () => {
    const fixtures = await fixtureService.getFixtures();
    return fixtures.filter(f => f.status === 'completed');
  },
  getLatestResult: async () => {
    const completed = await resultService.getResults();
    return completed[0]; // Simple latest for MVP
  }
};
