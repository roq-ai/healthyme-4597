import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface WorkoutPlanInterface {
  id?: string;
  plan_details: string;
  client_id?: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  _count?: {};
}

export interface WorkoutPlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  plan_details?: string;
  client_id?: string;
}
