import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ResetPasswordPage from '../../pages/ResetPasswordPage/ResetPasswordPage';
import { FYABackend } from '../../common/utils';
import RegisterPage from '../../pages/Register/RegisterPage';
import LoadingPage from '../../common/LoadingPage/LoadingPage';

const AuthEmail = ({ redirectPath }) => {
  const [invitedUser, setInvitedUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get('mode');
  const code = new URLSearchParams(search).get('oobCode');
  const inviteID = new URLSearchParams(search).get('inviteID');

  useEffect(async () => {
    if (mode === 'inviteUser' && inviteID !== null) {
      const user = await FYABackend.get(`/adminInvite/${inviteID}`);
      if (user && user.data) {
        setInvitedUser(user);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }
  if (mode === 'inviteUser') {
    if (inviteID === null) {
      return <Navigate to={redirectPath} />;
    }
    return <RegisterPage email={invitedUser.data.admin.email} />;
  }

  if (code === null || mode !== 'resetPassword') {
    return <Navigate to={redirectPath} />;
  }

  return <ResetPasswordPage code={code} />;
};

AuthEmail.propTypes = {
  redirectPath: PropTypes.string.isRequired,
};

export default AuthEmail;
