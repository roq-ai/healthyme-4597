import * as yup from 'yup';

export const healthTipValidationSchema = yup.object().shape({
  tip_details: yup.string().required(),
  client_id: yup.string().nullable(),
});
