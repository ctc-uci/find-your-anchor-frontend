import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ResetPasswordForm.module.css';
import PasswordInput from '../Inputs/PasswordInput';
import { confirmNewPassword } from '../../common/auth_utils';
import CommonConfirmationPage from '../../common/CommonConfirmationPage/CommonConfirmationPage';
import { useCustomToast } from '../ToastProvider/ToastProvider';

const schema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Please enter your password'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must both match'),
});

const ResetPasswordForm = ({ code }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useCustomToast();

  const returnToLogin = () => {
    navigate('/login');
  };

  const resetPassword = async data => {
    try {
      await confirmNewPassword(code, data.newPassword);
      setOpenConfirmation(true);
    } catch (err) {
      showToast({
        title: 'Error Resetting Password',
        message: err.message,
        toastPosition: 'bottom-right',
        type: 'error',
      });
    }
  };

  const onSubmit = data => {
    resetPassword(data);
  };

  return (
    <div className={styles['reset-password-form-container']}>
      <Text className={styles['form-heading']} textStyle="header-1">
        Reset Password
      </Text>
      <form className={styles['reset-password-form']} onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput
          register={register('newPassword')}
          error={errors?.newPassword}
          title="New Password"
        />
        <PasswordInput
          register={register('confirmPassword')}
          error={errors?.confirmPassword}
          title="Confirm New Password"
        />
        <div className={styles['action-panel']}>
          <Button to="/login" className={styles['return-to-login-button']} onClick={returnToLogin}>
            Return to Login
          </Button>
          <Button
            className={styles['reset-password-button']}
            type="submit"
            size="md"
            align="right"
            colorScheme="button"
          >
            Reset Password
          </Button>
          <CommonConfirmationPage
            isOpen={openConfirmation}
            confirmationTitle="Password Reset"
            confirmationText="You may now log into your account using your new password"
          />
        </div>
        <Link className={styles['return-to-login-link']} to="/login">
          Return to Login
        </Link>
      </form>
    </div>
  );
};

ResetPasswordForm.propTypes = {
  code: PropTypes.string.isRequired,
};

export default ResetPasswordForm;
