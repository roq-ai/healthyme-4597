import { AnalyticsInterface } from 'interfaces/analytics';
import { CommunityInterface } from 'interfaces/community';
import { DietPlanInterface } from 'interfaces/diet-plan';
import { HealthTipInterface } from 'interfaces/health-tip';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ClientInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  analytics?: AnalyticsInterface[];
  community?: CommunityInterface[];
  diet_plan?: DietPlanInterface[];
  health_tip?: HealthTipInterface[];
  workout_plan?: WorkoutPlanInterface[];
  user?: UserInterface;
  _count?: {
    analytics?: number;
    community?: number;
    diet_plan?: number;
    health_tip?: number;
    workout_plan?: number;
  };
}

export interface ClientGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
