import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PropTypes, instanceOf } from 'prop-types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading } from '@chakra-ui/react';
import styles from './LoginForm.module.css';
import TextInput from '../Inputs/TextInput';
import PasswordInput from '../Inputs/PasswordInput';
import { Cookies, withCookies } from '../../common/cookie_utils';
import {
  logInWithEmailAndPassword,
  signInWithGoogle,
  useNavigate,
  refreshToken,
  getCurrentUser,
  auth,
} from '../../common/auth_utils';

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid Email Address / Please enter your FYA email address')
    .required('Invalid Email Address / Please enter your FYA email address'),
  password: yup.string().required('Incorrect Password / Please enter your password'),
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
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to /logout, otherwise they are redirected to the login screen
   * @param {Event} e
   */
  const onSubmit = async e => {
    try {
      await logInWithEmailAndPassword(e.email, e.password, '/logout', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
      console.log(errorMessage);
    }
  };

  /**
   * This function handles logging in with Google
   * If the user logs in and is new, they are directed to a new-user path
   * If the user logs in and isn't new, they are directed to the dashboard.
   * If the user fails to log in, they are directed back to the login screen
   */
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle('/logout', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
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
    return <h1>LOADING...</h1>;
  }

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
        <Button className={styles['login-button']} type="submit" size="md">
          Log In
        </Button>
      </form>
      <Button className={styles['google-login-button']} onClick={handleGoogleSignIn} size="md">
        Sign In With Google
      </Button>
    </div>
  );
};

LoginForm.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
  redirectLink: PropTypes.string.isRequired,
};

export default withCookies(LoginForm);
