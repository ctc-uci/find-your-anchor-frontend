import React from 'react';
import AuthPageLayout from '../../components/AuthPageLayout/AuthPageLayout';
import ForgotPasswordForm from '../../components/ForgotPassword/ForgotPasswordForm';
import ForgotPasswordBackground from '../../assets/forgot-reset-password-background.jpg';

const ForgotPasswordPage = () => (
  <AuthPageLayout backgroundImage={ForgotPasswordBackground}>
    <ForgotPasswordForm />
  </AuthPageLayout>
);

export default ForgotPasswordPage;
