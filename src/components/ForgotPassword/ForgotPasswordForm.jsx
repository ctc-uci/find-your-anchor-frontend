import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading, Text } from '@chakra-ui/react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './ForgotPasswordForm.module.css';
import TextInput from '../Inputs/TextInput';
import { FYABackend } from '../../common/utils';
import { auth, getCurrentUser, sendPasswordReset } from '../../common/auth_utils';

// Check if user exists in the database
const userExists = async email => {
  try {
    const backendUser = await FYABackend.get(`/users/email/${email}`);
    return Object.keys(backendUser.data).length !== 0;
  } catch (err) {
    return false;
  }
};

function validateEmail() {
  return this.test('validEmail', async function emailCheck(value) {
    const { path, createError } = this;
    return (await userExists(value))
      ? true
      : createError({ path, message: 'This email has not been registered.' });
  });
}

yup.addMethod(yup.string, 'validEmail', validateEmail);
const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email address. Please enter your FYA email address')
    .required('Please enter your FYA email address')
    .validEmail('This email has not been registered.'),
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

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(async () => {
    const authenticated = await getCurrentUser(auth);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <h1>LOADING...</h1>;
  }

  // Redirects user to dashboard if they are logged in.
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const onSubmit = async data => {
    try {
      await sendPasswordReset(data.email);
      navigate('/login');
      // TODO: add toast component to confirm email has been sent (see Figma)
    } catch (err) {
      // TODO: replace with toast component
      console.log(err.message);
    }
  };

  const returnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles['forgot-password-form-container']}>
      <Heading className={styles['form-heading']}>FORGOT PASSWORD</Heading>
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
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
