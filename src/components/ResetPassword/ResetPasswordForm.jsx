import { React } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading, useDisclosure } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ResetPasswordForm.module.css';
import PasswordInput from '../Inputs/PasswordInput';
import ResetPasswordModal from './ResetPasswordModal/ResetPasswordModal';

const schema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Please enter your password'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword'), null], 'Please confirm your password'),
});

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const {
    isOpen: isOpenResetModal,
    onOpen: onOpenResetModal,
    onClose: onCloseResetModal,
  } = useDisclosure();

  const navigate = useNavigate();

  const returnToLogin = () => {
    navigate('/login');
  };

  // TODO: Implement reset password
  const resetPassword = () => {
    // Make request to reset password here
    // eslint-disable-next-line no-console
    console.log('password reset complete');
  };

  const onSubmit = data => {
    resetPassword();
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data));
    onOpenResetModal();
  };

  return (
    <div className={styles['reset-password-form-container']}>
      <Heading className={styles['form-heading']}>Reset Password</Heading>
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
          <Button
            to="/login"
            className={styles['return-to-login-button']}
            onClick={() => returnToLogin()}
          >
            Return to Login
          </Button>
          <Button className={styles['reset-password-button']} type="submit" size="md" align="right">
            Reset Password
          </Button>
          <ResetPasswordModal isOpen={isOpenResetModal} onClose={onCloseResetModal} />
        </div>
        <Link className={styles['return-to-login-link']} to="/login">
          Return to Login
        </Link>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
