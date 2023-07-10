import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface HealthTipInterface {
  id?: string;
  tip_details: string;
  client_id?: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  _count?: {};
}

export interface HealthTipGetQueryInterface extends GetQueryInterface {
  id?: string;
  tip_details?: string;
  client_id?: string;
}
