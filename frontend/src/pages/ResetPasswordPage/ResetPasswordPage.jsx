import React from 'react';
import PropTypes from 'prop-types';
import AuthPageLayout from '../../components/AuthPageLayout/AuthPageLayout';
import ResetPasswordForm from '../../components/ResetPassword/ResetPasswordForm';

const ResetPasswordPage = ({ code }) => (
  <AuthPageLayout>
    <ResetPasswordForm code={code} />
  </AuthPageLayout>
);

ResetPasswordPage.propTypes = {
  code: PropTypes.string.isRequired,
};

export default ResetPasswordPage;
