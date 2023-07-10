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
import { createAnalytics } from 'apiSdk/analytics';
import { Error } from 'components/error';
import { analyticsValidationSchema } from 'validationSchema/analytics';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';
import { AnalyticsInterface } from 'interfaces/analytics';

function AnalyticsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AnalyticsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAnalytics(values);
      resetForm();
      router.push('/analytics');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AnalyticsInterface>({
    initialValues: {
      analytics_details: '',
      client_id: (router.query.client_id as string) ?? null,
    },
    validationSchema: analyticsValidationSchema,
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
            Create Analytics
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="analytics_details" mb="4" isInvalid={!!formik.errors?.analytics_details}>
            <FormLabel>Analytics Details</FormLabel>
            <Input
              type="text"
              name="analytics_details"
              value={formik.values?.analytics_details}
              onChange={formik.handleChange}
            />
            {formik.errors.analytics_details && <FormErrorMessage>{formik.errors?.analytics_details}</FormErrorMessage>}
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
    entity: 'analytics',
    operation: AccessOperationEnum.CREATE,
  }),
)(AnalyticsCreatePage);
