import React from 'react';
import { Link } from 'react-router-dom';

import './NavBar.css';
import FYALogo from '../../assets/fya-logo.png';

function NavBar() {
  return (
    <div className="nav-bar">
      <div className="fya-logo">
        <img src={FYALogo} alt="Find Your Anchor Logo" />
      </div>
      <div className="navbar-buttons-and-account">
        <Link className="navbar-buttons" to="/add-box-form">
          Add Box
        </Link>
        <Link className="navbar-buttons" to="/upload-csv">
          Upload CSV
        </Link>
        <Link className="navbar-buttons" to="/export-csv">
          Export CSV
        </Link>
        <Link to="/profile">
          <div className="navbar-account">
            <span className="navbar-account-circle" />
            <p className="navbar-account-name">SA</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
