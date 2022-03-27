import { React, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Heading, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPasswordForm.module.css';
import PasswordInput from '../Inputs/PasswordInput';
import ResetPasswordModal from './ResetPasswordModal/ResetPasswordModal';

const schema = yup.object({
  newPassword: yup.string().min(8).required('Please enter your password'),
  // confirmPassword: yup.string().required('Please confirm your password'),
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
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  const returnToLogin = () => {
    navigate('/login');
  };

  const onSubmit = data => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data));
  };

  return (
    <div className={styles['reset-password-form-container']}>
      <Heading className={styles['form-heading']}>RESET PASSWORD</Heading>
      <form className={styles['reset-password-form']} onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput
          name="newPassword"
          register={register('newPassword')}
          error={errors?.newPassword}
          title="Password"
          value={newPasswordValue}
          onChange={e => setNewPasswordValue(e.currentTarget.newPasswordValue)}
        />
        <PasswordInput
          name="confirmPassword"
          register={register('confirmPassword')}
          error={errors?.confirmPassword}
          title="Confirm New Password"
          value={confirmPasswordValue}
          onChange={e => setConfirmPasswordValue(e.currentTarget.confirmPasswordValue)}
        />
        <div className={styles['action-panel']}>
          <Button
            to="/login"
            className={styles['return-to-login-button']}
            onClick={() => returnToLogin()}
          >
            Return to Login
          </Button>
          <Button
            error={errors?.confirmPassword}
            className={styles['reset-password-button']}
            onClick={
              newPasswordValue === confirmPasswordValue ? onOpenResetModal : onCloseResetModal
            }
            type="submit"
            size="md"
            align="right"
          >
            Reset Password
          </Button>
          <ResetPasswordModal isOpen={isOpenResetModal} onClose={onCloseResetModal} />
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
