import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface DietPlanInterface {
  id?: string;
  plan_details: string;
  client_id?: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  _count?: {};
}

export interface DietPlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  plan_details?: string;
  client_id?: string;
}
