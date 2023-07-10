import * as yup from 'yup';

export const workoutPlanValidationSchema = yup.object().shape({
  plan_details: yup.string().required(),
  client_id: yup.string().nullable(),
});
