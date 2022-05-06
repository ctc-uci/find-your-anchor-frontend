import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { Button, Text } from '@chakra-ui/react';
import { registerWithEmailAndPassword } from '../../common/auth_utils';
import styles from './RegisterForm.module.css';
import TextInput from '../Inputs/TextInput';
import PasswordInput from '../Inputs/PasswordInput';
import CommonConfirmationPage from '../../common/CommonConfirmationPage/CommonConfirmationPage';

const schema = yup.object({
  firstName: yup.string().required('Please enter your first name'),
  lastName: yup.string().required('Please enter your last name'),
  email: yup.string().email('Please enter your email address'),
  password: yup.string().required('Please enter a password'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Please confirm your password'),
});

const RegisterForm = ({ email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const [errorMessage, setErrorMessage] = useState();

  const onSubmit = async e => {
    try {
      if (e.password !== e.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      await registerWithEmailAndPassword(e.firstName, e.lastName, email, e.password);
      setOpenConfirmation(true);
    } catch (error) {
      setErrorMessage(error.message);
      console.log(errorMessage);
    }
  };

  return (
    <div className={styles['register-form-container']}>
      <Text className={styles['form-heading']} textStyle="header-1">
        Register
      </Text>
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
      <CommonConfirmationPage
        isOpen={openConfirmation}
        confirmationTitle="Account Registered"
        confirmationText="You may now log in using your new account"
      />
    </div>
  );
};

RegisterForm.propTypes = {
  email: PropTypes.string.isRequired,
};

export default RegisterForm;
