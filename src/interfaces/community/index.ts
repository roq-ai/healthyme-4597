import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface CommunityInterface {
  id?: string;
  community_details: string;
  client_id?: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  _count?: {};
}

export interface CommunityGetQueryInterface extends GetQueryInterface {
  id?: string;
  community_details?: string;
  client_id?: string;
}
