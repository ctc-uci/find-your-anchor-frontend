import React from 'react';
import { useNavigate } from 'react-router-dom';

import './NavBar.css';
import FYALogo from '../../assets/fya-logo.png';

function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="nav-bar">
      <div className="fya-logo">
        <img src={FYALogo} alt="Find Your Anchor Logo" />
      </div>
      <div className="buttons-and-account">
        <button type="button" className="buttons" onClick={() => navigate('../add-box-form')}>
          Add Box
        </button>
        <button type="button" className="buttons" onClick={() => navigate('../upload-csv')}>
          Upload CSV
        </button>
        <button type="button" className="buttons" onClick={() => navigate('../export-csv')}>
          Export CSV
        </button>
        <button type="button" onClick={() => navigate('../profile')}>
          <div className="account">
            <span className="circle" />
            <p className="account-name">SA</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default NavBar;
