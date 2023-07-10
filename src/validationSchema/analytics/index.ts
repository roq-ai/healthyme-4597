import * as yup from 'yup';

export const analyticsValidationSchema = yup.object().shape({
  analytics_details: yup.string().required(),
  client_id: yup.string().nullable(),
});
