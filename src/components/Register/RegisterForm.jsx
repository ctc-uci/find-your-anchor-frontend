import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes, { instanceOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button, Heading, useDisclosure } from '@chakra-ui/react';
import { Cookies, withCookies } from '../../common/cookie_utils';
import { signInWithGoogle, registerWithEmailAndPassword } from '../../common/auth_utils';
import styles from './RegisterForm.module.css';
import TextInput from '../Inputs/TextInput';
import PasswordInput from '../Inputs/PasswordInput';
import GoogleIcon from '../../assets/google-icon.svg';

import RegisterConfirmationPopup from './RegisterConfirmationPopup/RegisterConfirmationPopup';

const schema = yup.object({
  firstName: yup.string().required('Please enter your first name'),
  lastName: yup.string().required('Please enter your last name'),
  email: yup.string().email('Please enter your email address'),
  password: yup.string().required('Please enter a password'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Please confirm your password'),
});

const RegisterForm = ({ cookies, email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const {
    isOpen: isOpenConfirmedModal,
    onOpen: onOpenConfirmedModal,
    onClose: onCloseConfirmedModal,
  } = useDisclosure();

  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  const onSubmit = async e => {
    try {
      if (e.password !== e.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      await registerWithEmailAndPassword(e.firstName, e.lastName, email, e.password);
      onOpenConfirmedModal();
    } catch (error) {
      setErrorMessage(error.message);
      console.log(errorMessage);
    }
  };

  /**
   * This function handles signing up with Google
   * If the user logs in and is new, they are directed to a new-user path
   * If the user logs in and isn't new, they are directed to the dashboard.
   * If the user fails to log in, they are directed back to the login screen
   */
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle('/', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className={styles['register-form-container']}>
      <Heading className={styles['form-heading']}>Register</Heading>
      <form className={styles['register-form']} onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          register={register('firstName')}
          error={errors?.firstName}
          type="text"
          placeholder="Jane"
          title="First Name"
        />
        <TextInput
          register={register('lastName')}
          error={errors?.lastName}
          type="text"
          placeholder="Doe"
          title="Last Name"
        />
        <TextInput
          register={register('email')}
          error={errors?.email}
          type="text"
          placeholder={email}
          title="FYA Email Address"
          isEditable={false}
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
      <Button className={styles['google-register-button']} onClick={handleGoogleSignIn} size="md">
        <img src={GoogleIcon} alt="google" className={styles['google-icon']} /> Register with Google
      </Button>
      <RegisterConfirmationPopup isOpen={isOpenConfirmedModal} onClose={onCloseConfirmedModal} />
    </div>
  );
};

RegisterForm.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
  email: PropTypes.string.isRequired,
};

export default withCookies(RegisterForm);
