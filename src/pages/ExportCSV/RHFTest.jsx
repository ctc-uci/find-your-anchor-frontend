import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ChakraProvider, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

import './ExportCSV.css';

function isPalindrome(message) {
  return this.test('isPalindrome', message, function palindromeCheck(value) {
    const { path, createError } = this;

    const re = /[\W_]/g;
    const lowRegStr = value.toLowerCase().replace(re, '');
    const reverseStr = lowRegStr.split('').reverse().join('');

    if (reverseStr === lowRegStr) {
      return true;
    }

    return createError({ path, message: message ?? 'Not a palindrome' });
  });
}
yup.addMethod(yup.mixed, 'isPalindrome', isPalindrome);

const schema = yup
  .object({
    requiredText: yup.string().required(),
    requiredNum: yup
      .number()
      .typeError('requiredNum must be a positive number')
      .positive()
      .integer()
      .required(),
    palindrome: yup.mixed().isPalindrome(),
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

          <FormControl isInvalid={errors?.palindrome}>
            <FormLabel htmlFor="palindrome">Enter a palindrome</FormLabel>
            <Input id="palindrome" placeholder="e.g. racecar" {...register('palindrome')} />
            <p className="error-message">{errors.palindrome?.message}</p>
          </FormControl>

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </ChakraProvider>
  );
};

export default RHFTest;
