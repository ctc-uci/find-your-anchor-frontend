import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';
import PlaceHolderPFP from '../../assets/placeholder_pfp.svg';

const AdminLinks = () => (
  <>
    <NavLink
      to="/add-box-form"
      className={navLink =>
        navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
      }
    >
      Add Box
    </NavLink>
    <NavLink
      to="/upload-csv"
      className={navLink =>
        navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
      }
    >
      Upload CSV
    </NavLink>
    <NavLink
      to="/export-csv"
      className={navLink =>
        navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
      }
    >
      Export CSV
    </NavLink>
  </>
);

const UserLinks = () => (
  <>
    <NavLink
      to="/relocate-box-form"
      className={navLink =>
        navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
      }
    >
      Relocate a Box
    </NavLink>
    <NavLink
      to="/pickup-box-form"
      className={navLink =>
        navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
      }
    >
      Pick Up a Box
    </NavLink>
  </>
);

const NavBar = ({ isAdmin }) => {
  return (
    <div className={styles['nav-bar']}>
      <NavLink to="/">
        <div className={styles['fya-logo']}>
          <img src={FYALogo} alt="Find Your Anchor Logo" />
        </div>
      </NavLink>
      <div className={styles['navbar-buttons-and-account']}>
        <div className={styles['navbar-buttons']}>{isAdmin ? <AdminLinks /> : <UserLinks />}</div>
        {isAdmin && (
          <NavLink to="/profile">
            <div className={styles['navbar-account']}>
              <img className={styles['profile-picture']} src={PlaceHolderPFP} alt="Profile" />
            </div>
          </NavLink>
        )}
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
