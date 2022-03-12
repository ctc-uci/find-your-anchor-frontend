import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading } from '@chakra-ui/react';
import styles from './ResetPasswordForm.module.css';
import PasswordInput from '../Inputs/PasswordInput';

const schema = yup.object({
  newPassword: yup.string().required('Password must be at least 8 characters'),
  confirmPassword: yup.string().required('Passwords must both match'),
});

const LoginForm = returnToLoginPage => {
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
    <div className={styles['reset-password-form-container']}>
      <Heading className={styles['form-heading']}>RESET PASSWORD</Heading>
      <form className={styles['reset-password-form']} onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput
          register={register('password')}
          error={errors?.newPassword}
          title="New Password"
        />
        <PasswordInput
          register={register('password')}
          error={errors?.confirmPassword}
          title="Confirm New Password"
        />
        <div className={styles['action-panel']}>
          <Button className={styles['reset-password-button']} type="submit" size="md">
            Reset
          </Button>
          {returnToLoginPage && (
            <div className={styles['reset-password-wrapper']} align="left">
              <Link className={styles['reset-password']} to="/login">
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

// LoginForm.defaultProps = {
//   returnToLoginPage: false,
// };

export default LoginForm;
