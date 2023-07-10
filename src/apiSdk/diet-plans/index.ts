import axios from 'axios';
import queryString from 'query-string';
import { DietPlanInterface, DietPlanGetQueryInterface } from 'interfaces/diet-plan';
import { GetQueryInterface } from '../../interfaces';

export const getDietPlans = async (query?: DietPlanGetQueryInterface) => {
  const response = await axios.get(`/api/diet-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDietPlan = async (dietPlan: DietPlanInterface) => {
  const response = await axios.post('/api/diet-plans', dietPlan);
  return response.data;
};

export const updateDietPlanById = async (id: string, dietPlan: DietPlanInterface) => {
  const response = await axios.put(`/api/diet-plans/${id}`, dietPlan);
  return response.data;
};

export const getDietPlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/diet-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDietPlanById = async (id: string) => {
  const response = await axios.delete(`/api/diet-plans/${id}`);
  return response.data;
};
