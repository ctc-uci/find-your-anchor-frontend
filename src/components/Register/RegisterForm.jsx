import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading } from '@chakra-ui/react';
import styles from './RegisterForm.module.css';
import TextInput from '../Inputs/TextInput';
import PasswordInput from '../Inputs/PasswordInput';

const schema = yup.object({
  firstName: yup.string().required('Please enter your first name.'),
  lastName: yup.string().required('Please enter your last name.'),
  email: yup
    .string()
    .email('Invalid Email Address / Please enter your FYA email address')
    .required('Invalid Email Address / Please enter your FYA email address'),
  password: yup
    .string()
    .required('Please enter a password / Passwords must contain a special character'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Please confirm your password / Passwords must both match'),
});

const RegisterForm = () => {
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
    <div className={styles['register-form-container']}>
      <Heading className={styles['form-heading']}>REGISTER</Heading>
      <form className={styles['register-form']} onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          register={register('firstName')}
          error={errors?.firstName}
          type="text"
          title="First Name"
        />
        <TextInput
          register={register('lastName')}
          error={errors?.lastName}
          type="text"
          title="Last Name"
        />
        <TextInput
          register={register('email')}
          error={errors?.email}
          type="text"
          title="FYA Email Address"
        />
        <PasswordInput register={register('password')} error={errors?.password} title="Password" />
        <PasswordInput
          register={register('confirmPassword')}
          error={errors?.confirmPassword}
          title="Confirm Password"
        />
        <Button className={styles['register-button']} type="submit" size="md">
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
