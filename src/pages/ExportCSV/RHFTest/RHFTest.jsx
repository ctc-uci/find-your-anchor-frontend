import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ChakraProvider, Text, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import '../ExportCSV.css';

import { isPalindrome, isZip, isValidRange } from './RHFTestValidators';

// Adds custom validators
yup.addMethod(yup.mixed, 'isPalindrome', isPalindrome);
yup.addMethod(yup.mixed, 'isZip', isZip);
yup.addMethod(yup.mixed, 'isValidRange', isValidRange);
const schema = yup
  .object({
    requiredText: yup.mixed().required(),
    requiredNum: yup
      .number()
      .typeError('requiredNum must be a positive number')
      .positive()
      .integer()
      .required(),
    palindrome: yup.mixed().isPalindrome(),
    zipcode: yup.mixed().isZip(),
    range: yup.mixed().isValidRange(),
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
        <Text fontSize="2xl">RHF Test</Text>
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

          <FormControl isInvalid={errors?.palindrome}>
            <FormLabel htmlFor="palindrome">Enter a palindrome</FormLabel>
            <Input id="palindrome" placeholder="e.g. racecar" {...register('palindrome')} />
            <p className="error-message">{errors.palindrome?.message}</p>
          </FormControl>

          <FormControl isInvalid={errors?.zip}>
            <FormLabel htmlFor="zipcode">Enter a zipcode list</FormLabel>
            <Input id="zipcode" placeholder="e.g. 96152, 91007" {...register('zipcode')} />
            <p className="error-message">{errors.zipcode?.message}</p>
          </FormControl>

          <FormControl isInvalid={errors?.range}>
            <FormLabel htmlFor="range">Enter a range of numbers</FormLabel>
            <Input id="range" placeholder="e.g. 1-9, 6, 12" {...register('range')} />
            <p className="error-message">{errors.range?.message}</p>
          </FormControl>

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </ChakraProvider>
  );
};

export default RHFTest;
