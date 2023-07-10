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
import { getCommunityById, updateCommunityById } from 'apiSdk/communities';
import { Error } from 'components/error';
import { communityValidationSchema } from 'validationSchema/communities';
import { CommunityInterface } from 'interfaces/community';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';

function CommunityEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CommunityInterface>(
    () => (id ? `/communities/${id}` : null),
    () => getCommunityById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CommunityInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCommunityById(id, values);
      mutate(updated);
      resetForm();
      router.push('/communities');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CommunityInterface>({
    initialValues: data,
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
            Edit Community
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
            <FormControl id="community_details" mb="4" isInvalid={!!formik.errors?.community_details}>
              <FormLabel>Community Details</FormLabel>
              <Input
                type="text"
                name="community_details"
                value={formik.values?.community_details}
                onChange={formik.handleChange}
              />
              {formik.errors.community_details && (
                <FormErrorMessage>{formik.errors?.community_details}</FormErrorMessage>
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
    entity: 'community',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CommunityEditPage);
