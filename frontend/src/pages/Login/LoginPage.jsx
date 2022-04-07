import React from 'react';
import LoginForm from '../../components/Login/LoginForm';
import AuthPageLayout from '../../components/AuthPageLayout/AuthPageLayout';

const LoginPage = () => (
  <AuthPageLayout>
    <LoginForm redirectLink="/" />
  </AuthPageLayout>
);

export default LoginPage;
