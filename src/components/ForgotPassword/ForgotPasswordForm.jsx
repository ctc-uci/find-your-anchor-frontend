import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading } from '@chakra-ui/react';
import styles from './ForgotPasswordForm.module.css';
import TextInput from '../Inputs/TextInput';

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid Email Address / Please enter your FYA email address')
    .required('Invalid Email Address / Please enter your FYA email address'),
});

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const onSubmit = data => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data));
  };

  return (
    <div className={styles['login-form-container']}>
      <Heading className={styles['form-heading']}>FORGOT PASSWORD</Heading>
      <form className={styles['login-form']} onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          register={register('email')}
          error={errors?.email}
          type="text"
          placeholder="name@findyouranchor.us"
          title="FYA Email Address"
        />
        <Button className={styles['login-button']} type="submit" size="md">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
