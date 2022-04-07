import React from 'react';
import PropTypes from 'prop-types';
import AuthPageLayout from '../../components/AuthPageLayout/AuthPageLayout';
import RegisterForm from '../../components/Register/RegisterForm';

const RegisterPage = ({ email }) => (
  <AuthPageLayout>
    <RegisterForm email={email} />
  </AuthPageLayout>
);

RegisterPage.propTypes = {
  email: PropTypes.string.isRequired,
};

export default RegisterPage;
