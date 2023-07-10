const mapping: Record<string, string> = {
  analytics: 'analytics',
  clients: 'client',
  communities: 'community',
  'diet-plans': 'diet_plan',
  'health-tips': 'health_tip',
  users: 'user',
  'workout-plans': 'workout_plan',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
