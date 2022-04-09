import React from 'react';
import PropTypes from 'prop-types';
import AuthPageLayout from '../../components/AuthPageLayout/AuthPageLayout';
import RegisterForm from '../../components/Register/RegisterForm';
import RegisterBackground from '../../assets/register-background.svg';

const RegisterPage = ({ email }) => (
  <AuthPageLayout backgroundImage={RegisterBackground}>
    <RegisterForm email={email} />
  </AuthPageLayout>
);

RegisterPage.propTypes = {
  email: PropTypes.string.isRequired,
};

export default RegisterPage;
