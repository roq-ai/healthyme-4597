import axios from 'axios';
import queryString from 'query-string';
import { HealthTipInterface, HealthTipGetQueryInterface } from 'interfaces/health-tip';
import { GetQueryInterface } from '../../interfaces';

export const getHealthTips = async (query?: HealthTipGetQueryInterface) => {
  const response = await axios.get(`/api/health-tips${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHealthTip = async (healthTip: HealthTipInterface) => {
  const response = await axios.post('/api/health-tips', healthTip);
  return response.data;
};

export const updateHealthTipById = async (id: string, healthTip: HealthTipInterface) => {
  const response = await axios.put(`/api/health-tips/${id}`, healthTip);
  return response.data;
};

export const getHealthTipById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/health-tips/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHealthTipById = async (id: string) => {
  const response = await axios.delete(`/api/health-tips/${id}`);
  return response.data;
};
