import axios from 'axios';
import queryString from 'query-string';
import { CommunityInterface, CommunityGetQueryInterface } from 'interfaces/community';
import { GetQueryInterface } from '../../interfaces';

export const getCommunities = async (query?: CommunityGetQueryInterface) => {
  const response = await axios.get(`/api/communities${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCommunity = async (community: CommunityInterface) => {
  const response = await axios.post('/api/communities', community);
  return response.data;
};

export const updateCommunityById = async (id: string, community: CommunityInterface) => {
  const response = await axios.put(`/api/communities/${id}`, community);
  return response.data;
};

export const getCommunityById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/communities/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCommunityById = async (id: string) => {
  const response = await axios.delete(`/api/communities/${id}`);
  return response.data;
};
