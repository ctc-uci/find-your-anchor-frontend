import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PropTypes, instanceOf } from 'prop-types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Text } from '@chakra-ui/react';
import styles from './LoginForm.module.css';
import TextInput from '../Inputs/TextInput';
import PasswordInput from '../Inputs/PasswordInput';
import { Cookies, withCookies } from '../../common/cookie_utils';
import { useCustomToast } from '../ToastProvider/ToastProvider';
import {
  logInWithEmailAndPassword,
  useNavigate,
  refreshToken,
  getCurrentUser,
  auth,
} from '../../common/auth_utils';
import LoadingPage from '../../common/LoadingPage/LoadingPage';

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter your FYA email address')
    .required('Please enter your FYA email address'),
  password: yup.string().required('Please enter your password'),
});

const LoginForm = ({ cookies, redirectLink }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useCustomToast();
  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to /logout, otherwise they are redirected to the login screen
   * @param {Event} e
   */
  const onSubmit = async e => {
    try {
      await logInWithEmailAndPassword(e.email, e.password, '/', navigate, cookies);
    } catch (err) {
      showToast({
        title: 'Error Logging In',
        message: err.message,
        toastPosition: 'bottom-right',
        type: 'error',
      });
    }
  };

  useEffect(async () => {
    const user = await getCurrentUser(auth);
    if (user !== null) {
      await refreshToken();
      navigate(redirectLink);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className={styles['login-form-container']}>
      <Text className={styles['form-heading']} textStyle="header-1">
        Login
      </Text>
      <form className={styles['login-form']} onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          register={register('email')}
          error={errors?.email}
          type="text"
          placeholder="celinedion@findyouranchor.us"
          title="FYA Email Address"
        />
        <PasswordInput
          register={register('password')}
          error={errors?.password}
          title="Password"
          showForgotPassword
        />
        <Button className={styles['login-button']} type="submit" size="md" colorScheme="button">
          Log In
        </Button>
        <Link className={styles['forgot-password']} to="/forgot-password">
          Forgot Password?
        </Link>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
  redirectLink: PropTypes.string.isRequired,
};

export default withCookies(LoginForm);
