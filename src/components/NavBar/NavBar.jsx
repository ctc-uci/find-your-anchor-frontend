import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';

import { FYABackend } from '../../common/utils';
import { getCurrentUser, auth } from '../../common/auth_utils';

const AdminLinks = () => (
  <>
    <Link to="/add-box-form">Add Box</Link>
    <Link to="/upload-csv">Upload CSV</Link>
    <Link to="/export-csv">Export CSV</Link>
  </>
);

const UserLinks = () => (
  <>
    <Link to="/">Relocate a Box</Link>
    <Link to="/">Pick Up a Box</Link>
  </>
);

const getUserInitials = async () => {
  const user = await getCurrentUser(auth);
  const backendUser = await FYABackend.get(`/users/userId/${user.uid}`);
  return (
    (backendUser.data.user.first_name ? backendUser.data.user.first_name[0] : '') +
    (backendUser.data.user.last_name ? backendUser.data.user.last_name[0] : '')
  );
};

const NavBar = ({ isAdmin }) => {
  const [initials, setInitials] = useState('');

  useEffect(async () => {
    const temp = await getUserInitials();
    setInitials(temp);
  }, []);

  return (
    <div className={styles['nav-bar']}>
      <Link to="/">
        <img src={FYALogo} alt="Find Your Anchor Logo" />
      </Link>
      <div className={styles['navbar-buttons-and-account']}>
        <div className={styles['navbar-buttons']}>{isAdmin ? <AdminLinks /> : <UserLinks />}</div>
        <Link to="/profile">
          <div className={styles['navbar-initials']}>{initials}</div>
        </Link>
      </div>
    </div>
  );
};

NavBar.defaultProps = {
  isAdmin: false,
};

NavBar.propTypes = {
  isAdmin: PropTypes.bool,
};

export default NavBar;
