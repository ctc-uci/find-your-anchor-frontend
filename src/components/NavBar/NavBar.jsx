import React from 'react';
import { Link } from 'react-router-dom';

import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';

function NavBar() {
  return (
    <div className={styles['nav-bar']}>
      <div className={styles['fya-logo']}>
        <img src={FYALogo} alt="Find Your Anchor Logo" />
      </div>
      <div className={styles['navbar-buttons-and-account']}>
        <Link className={styles['navbar-buttons']} to="/add-box-form">
          Add Box
        </Link>
        <Link className={styles['navbar-buttons']} to="/upload-csv">
          Upload CSV
        </Link>
        <Link className={styles['navbar-buttons']} to="/export-csv">
          Export CSV
        </Link>
        <Link to="/profile">
          <div className={styles['navbar-account']}>
            <span className={styles['navbar-account-circle']} />
            <p className={styles['navbar-account-name']}>SA</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
