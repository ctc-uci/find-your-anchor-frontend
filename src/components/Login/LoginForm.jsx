import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading } from '@chakra-ui/react';
import styles from './LoginForm.module.css';
import TextInput from '../Inputs/TextInput';
import PasswordInput from '../Inputs/PasswordInput';

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid Email Address / Please enter your FYA email address')
    .required('Invalid Email Address / Please enter your FYA email address'),
  password: yup.string().required('Incorrect Password / Please enter your password'),
});

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const onSubmit = data => {
    alert(JSON.stringify(data));
  };

  return (
    <div className={styles['login-form-container']}>
      <Heading className={styles['form-heading']}>LOGIN</Heading>
      <form className={styles['login-form']} onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          register={register('email')}
          error={errors?.email}
          type="text"
          placeholder="name@findyouranchor.us"
          title="FYA Email Address"
        />
        <PasswordInput
          register={register('password')}
          error={errors?.password}
          title="Password"
          showForgotPassword
        />
        <div align="right">
          <Button className={styles['login-button']} type="submit" size="md">
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
