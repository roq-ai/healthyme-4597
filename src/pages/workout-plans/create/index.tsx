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
import { createWorkoutPlan } from 'apiSdk/workout-plans';
import { Error } from 'components/error';
import { workoutPlanValidationSchema } from 'validationSchema/workout-plans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';

function WorkoutPlanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WorkoutPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWorkoutPlan(values);
      resetForm();
      router.push('/workout-plans');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WorkoutPlanInterface>({
    initialValues: {
      plan_details: '',
      client_id: (router.query.client_id as string) ?? null,
    },
    validationSchema: workoutPlanValidationSchema,
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
            Create Workout Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="plan_details" mb="4" isInvalid={!!formik.errors?.plan_details}>
            <FormLabel>Plan Details</FormLabel>
            <Input type="text" name="plan_details" value={formik.values?.plan_details} onChange={formik.handleChange} />
            {formik.errors.plan_details && <FormErrorMessage>{formik.errors?.plan_details}</FormErrorMessage>}
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
    entity: 'workout_plan',
    operation: AccessOperationEnum.CREATE,
  }),
)(WorkoutPlanCreatePage);
