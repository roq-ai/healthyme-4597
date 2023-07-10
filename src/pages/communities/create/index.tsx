import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCommunity } from 'apiSdk/communities';
import { Error } from 'components/error';
import { communityValidationSchema } from 'validationSchema/communities';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';
import { CommunityInterface } from 'interfaces/community';

function CommunityCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CommunityInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCommunity(values);
      resetForm();
      router.push('/communities');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CommunityInterface>({
    initialValues: {
      community_details: '',
      client_id: (router.query.client_id as string) ?? null,
    },
    validationSchema: communityValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Community
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="community_details" mb="4" isInvalid={!!formik.errors?.community_details}>
            <FormLabel>Community Details</FormLabel>
            <Input
              type="text"
              name="community_details"
              value={formik.values?.community_details}
              onChange={formik.handleChange}
            />
            {formik.errors.community_details && <FormErrorMessage>{formik.errors?.community_details}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ClientInterface>
            formik={formik}
            name={'client_id'}
            label={'Select Client'}
            placeholder={'Select Client'}
            fetcher={getClients}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'community',
    operation: AccessOperationEnum.CREATE,
  }),
)(CommunityCreatePage);
