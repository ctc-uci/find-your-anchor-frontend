import React from 'react';

import './NavBar.css';
import FYALogo from '../../assets/fya-logo.png';

function NavBar() {
  return (
    <div className="nav-bar">
      <div className="fya-logo">
        <img src={FYALogo} alt="Find Your Anchor Logo" />
      </div>
      <div className="buttons-and-account">
        <a className="buttons" href="../add-box-form">
          Add Box
        </a>
        <a className="buttons" href="../upload-csv">
          Upload CSV
        </a>
        <a className="buttons" href="../export-csv">
          Export CSV
        </a>
        <a href="../profile">
          <div className="account">
            <span className="circle" />
            <p className="account-name">SA</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default NavBar;
