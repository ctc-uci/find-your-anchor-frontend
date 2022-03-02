import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';
import PlaceHolderPFP from '../../assets/placeholder_pfp.jpg';

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

const NavBar = ({ isAdmin }) => {
  return (
    <div className={styles['nav-bar']}>
      <div className={styles['fya-logo']}>
        <img src={FYALogo} alt="Find Your Anchor Logo" />
      </div>
      <div className={styles['navbar-buttons-and-account']}>
        <div className={styles['navbar-buttons']}>{isAdmin ? <AdminLinks /> : <UserLinks />}</div>
        <Link to="/profile">
          <div className={styles['navbar-account']}>
            <img className={styles['profile-picture']} src={PlaceHolderPFP} alt="Profile" />
          </div>
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
