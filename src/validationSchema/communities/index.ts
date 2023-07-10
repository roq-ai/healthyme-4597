import * as yup from 'yup';

export const communityValidationSchema = yup.object().shape({
  community_details: yup.string().required(),
  client_id: yup.string().nullable(),
});
