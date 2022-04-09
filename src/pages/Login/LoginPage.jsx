import React from 'react';
import LoginForm from '../../components/Login/LoginForm';
import AuthPageLayout from '../../components/AuthPageLayout/AuthPageLayout';
import LoginBackground from '../../assets/login-background.svg';

const LoginPage = () => (
  <AuthPageLayout backgroundImage={LoginBackground}>
    <LoginForm redirectLink="/" />
  </AuthPageLayout>
);

export default LoginPage;
