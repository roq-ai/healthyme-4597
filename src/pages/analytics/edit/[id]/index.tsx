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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getAnalyticsById, updateAnalyticsById } from 'apiSdk/analytics';
import { Error } from 'components/error';
import { analyticsValidationSchema } from 'validationSchema/analytics';
import { AnalyticsInterface } from 'interfaces/analytics';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';

function AnalyticsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AnalyticsInterface>(
    () => (id ? `/analytics/${id}` : null),
    () => getAnalyticsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AnalyticsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAnalyticsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/analytics');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AnalyticsInterface>({
    initialValues: data,
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
            Edit Analytics
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="analytics_details" mb="4" isInvalid={!!formik.errors?.analytics_details}>
              <FormLabel>Analytics Details</FormLabel>
              <Input
                type="text"
                name="analytics_details"
                value={formik.values?.analytics_details}
                onChange={formik.handleChange}
              />
              {formik.errors.analytics_details && (
                <FormErrorMessage>{formik.errors?.analytics_details}</FormErrorMessage>
              )}
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(AnalyticsEditPage);
