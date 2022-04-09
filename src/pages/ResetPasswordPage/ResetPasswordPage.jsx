import React from 'react';
import PropTypes from 'prop-types';
import AuthPageLayout from '../../components/AuthPageLayout/AuthPageLayout';
import ResetPasswordForm from '../../components/ResetPassword/ResetPasswordForm';
import ResetPasswordBackground from '../../assets/forgot-reset-password-background.svg';

const ResetPasswordPage = ({ code }) => (
  <AuthPageLayout backgroundImage={ResetPasswordBackground}>
    <ResetPasswordForm code={code} />
  </AuthPageLayout>
);

ResetPasswordPage.propTypes = {
  code: PropTypes.string.isRequired,
};

export default ResetPasswordPage;
