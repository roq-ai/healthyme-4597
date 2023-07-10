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
import { createHealthTip } from 'apiSdk/health-tips';
import { Error } from 'components/error';
import { healthTipValidationSchema } from 'validationSchema/health-tips';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';
import { HealthTipInterface } from 'interfaces/health-tip';

function HealthTipCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HealthTipInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHealthTip(values);
      resetForm();
      router.push('/health-tips');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HealthTipInterface>({
    initialValues: {
      tip_details: '',
      client_id: (router.query.client_id as string) ?? null,
    },
    validationSchema: healthTipValidationSchema,
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
            Create Health Tip
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="tip_details" mb="4" isInvalid={!!formik.errors?.tip_details}>
            <FormLabel>Tip Details</FormLabel>
            <Input type="text" name="tip_details" value={formik.values?.tip_details} onChange={formik.handleChange} />
            {formik.errors.tip_details && <FormErrorMessage>{formik.errors?.tip_details}</FormErrorMessage>}
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
    entity: 'health_tip',
    operation: AccessOperationEnum.CREATE,
  }),
)(HealthTipCreatePage);
