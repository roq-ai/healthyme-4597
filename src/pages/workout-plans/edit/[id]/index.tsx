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
import { getWorkoutPlanById, updateWorkoutPlanById } from 'apiSdk/workout-plans';
import { Error } from 'components/error';
import { workoutPlanValidationSchema } from 'validationSchema/workout-plans';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';

function WorkoutPlanEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WorkoutPlanInterface>(
    () => (id ? `/workout-plans/${id}` : null),
    () => getWorkoutPlanById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: WorkoutPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateWorkoutPlanById(id, values);
      mutate(updated);
      resetForm();
      router.push('/workout-plans');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<WorkoutPlanInterface>({
    initialValues: data,
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
            Edit Workout Plan
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
            <FormControl id="plan_details" mb="4" isInvalid={!!formik.errors?.plan_details}>
              <FormLabel>Plan Details</FormLabel>
              <Input
                type="text"
                name="plan_details"
                value={formik.values?.plan_details}
                onChange={formik.handleChange}
              />
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
    entity: 'workout_plan',
    operation: AccessOperationEnum.UPDATE,
  }),
)(WorkoutPlanEditPage);
