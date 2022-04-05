import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ForgotPasswordForm.module.css';
import TextInput from '../Inputs/TextInput';

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter your FYA email address')
    .required('Please enter your FYA email address'),
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

  const navigate = useNavigate();

  const onSubmit = data => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data));
  };

  const returnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles['forgot-password-form-container']}>
      <Heading className={styles['form-heading']}>Forgot Password</Heading>
      <Text className={styles['info-text']}>
        Please enter your registered FYA email address and we will send you a link to reset your
        password.
      </Text>
      <form className={styles['forgot-password-form']} onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          register={register('email')}
          error={errors?.email}
          type="text"
          placeholder="name@findyouranchor.us"
          title="FYA Email Address"
        />
        <div className={styles['action-panel']}>
          <Button
            to="/login"
            className={styles['return-to-login-button']}
            onClick={() => returnToLogin()}
          >
            Return to Login
          </Button>
          <Button className={styles['send-email-button']} type="submit" size="md">
            Send Email
          </Button>
        </div>
        <Link className={styles['return-to-login-link']} to="/login">
          Return to Login
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
