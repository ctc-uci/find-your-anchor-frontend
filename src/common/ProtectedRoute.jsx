import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { PropTypes, instanceOf } from 'prop-types';
import { withCookies, Cookies, clearCookies } from './cookie_utils';
import { refreshToken } from './auth_utils';
import { FYABackend } from './utils';
import LoadingPage from './LoadingPage/LoadingPage';

const userIsAuthenticated = async cookies => {
  try {
    const accessToken = await refreshToken(cookies);
    if (!accessToken) {
      return false;
    }
    const loggedIn = await FYABackend.get(`/auth/verifyToken/${accessToken}`);
    return loggedIn.status === 200;
  } catch (err) {
    clearCookies(cookies);
    return false;
  }
};

/**
 * Protects a route from unauthenticated users
 * @param {Component} children The component the user is trying to access
 * @param {string} redirectPath The path to redirect the user to if they're not logged in
 * @param {Cookies} cookies The user's current cookies
 * @returns The relevant path to redirect the user to depending on authentication state.
 */
const ProtectedRoute = ({ Component, redirectPath, cookies }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(async () => {
    const authenticated = await userIsAuthenticated(cookies);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);
  if (isLoading) {
    return <LoadingPage />;
  }
  if (isAuthenticated) {
    return <Component />;
  }
  return <Navigate to={redirectPath} />;
};

ProtectedRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
  redirectPath: PropTypes.string.isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ProtectedRoute);
