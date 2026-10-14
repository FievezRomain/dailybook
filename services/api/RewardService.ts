import type { RewardSummary, RewardTransaction } from '../../models/Reward';
import httpClient from './httpClient';

export async function getSummary(): Promise<RewardSummary> {
  const response = await httpClient.get('/rewards/summary');
  return response.data;
}

export async function getHistory(): Promise<RewardTransaction[]> {
  const response = await httpClient.get('/rewards/history');
  return response.data;
}

export async function dailyCheckIn(): Promise<RewardSummary> {
  const response = await httpClient.post('/rewards/check-ins/daily');
  return response.data;
}
