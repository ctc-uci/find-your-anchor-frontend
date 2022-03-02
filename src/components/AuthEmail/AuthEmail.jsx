import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';

const AuthEmail = ({ redirectPath }) => {
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get('mode');
  const code = new URLSearchParams(search).get('oobCode');

  if (code === null) {
    return <Navigate to={redirectPath} />;
  }
  return mode === 'resetPassword' ? <ResetPassword code={code} /> : <VerifyEmail code={code} />;
};

AuthEmail.propTypes = {
  redirectPath: PropTypes.string.isRequired,
};

export default AuthEmail;
