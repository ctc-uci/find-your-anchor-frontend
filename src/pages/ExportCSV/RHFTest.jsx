import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ChakraProvider, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

import './ExportCSV.css';

const schema = yup
  .object({
    requiredText: yup.string().required(),
    requiredNum: yup.number().positive().integer().required(),
  })
  .required();

const RHFTest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => alert(JSON.stringify(data, null, 2));

  return (
    <ChakraProvider>
      <div>
        <h2>RHF Test</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors?.requiredText}>
            <FormLabel htmlFor="requiredText">Required Text</FormLabel>
            <Input id="requiredText" placeholder="Enter Text" {...register('requiredText')} />
            <p className="error-message">{errors.requiredText?.message}</p>
          </FormControl>

          <FormControl isInvalid={errors?.requiredNum}>
            <FormLabel htmlFor="requiredNum">Required Positive Number</FormLabel>
            <Input id="requiredNum" placeholder="Enter Number" {...register('requiredNum')} />
            <p className="error-message">{errors.requiredNum?.message}</p>
          </FormControl>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </ChakraProvider>
  );
};

export default RHFTest;
