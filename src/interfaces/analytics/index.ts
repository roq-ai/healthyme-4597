import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface AnalyticsInterface {
  id?: string;
  analytics_details: string;
  client_id?: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  _count?: {};
}

export interface AnalyticsGetQueryInterface extends GetQueryInterface {
  id?: string;
  analytics_details?: string;
  client_id?: string;
}
